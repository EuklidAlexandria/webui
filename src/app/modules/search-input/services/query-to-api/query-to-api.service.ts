import { Injectable } from '@angular/core';
import { ParamsBuilder, ParamsBuilderGroup } from 'app/helpers/params-builder/params-builder.class';
import { QueryFilter, QueryFilters } from 'app/interfaces/query-api.interface';
import {
  Condition, ConditionGroup, ConnectorType, isConditionGroup,
  LiteralValue,
  QueryParsingResult,
} from 'app/modules/search-input/services/query-parser/query-parsing-result.interface';
import { PropertyType, SearchProperty } from 'app/modules/search-input/types/search-property.interface';

@Injectable()
export class QueryToApiService<T> {
  private builder: ParamsBuilder<T>;
  private searchProperties: SearchProperty<T>[];

  buildFilters(query: QueryParsingResult, properties: SearchProperty<T>[]): QueryFilters<T> {
    this.searchProperties = properties;
    this.builder = new ParamsBuilder<T>();
    this.addNode(this.builder, query.tree);

    return this.builder.getFilters();
  }

  private addNode(paramsGroup: ParamsBuilderGroup<T>, node: Condition | ConditionGroup): void {
    if (isConditionGroup(node)) {
      this.buildGroup(paramsGroup, node);
      return;
    }

    paramsGroup.filter(...this.buildCondition(node));
  }

  private buildGroup(paramsGroup: ParamsBuilderGroup<T>, conditionGroup: ConditionGroup): void {
    // Left
    if (isConditionGroup(conditionGroup.left)) {
      paramsGroup.group((leftGroup) => {
        this.buildGroup(leftGroup, conditionGroup.left as ConditionGroup);
      });
    } else {
      paramsGroup.filter(...this.buildCondition(conditionGroup.left));
    }

    // Right OR
    if (conditionGroup.connector === ConnectorType.Or) {
      if (isConditionGroup(conditionGroup.right)) {
        paramsGroup.orGroup((rightGroup) => {
          this.buildGroup(rightGroup, conditionGroup.right as ConditionGroup);
        });
      } else {
        paramsGroup.orFilter(...this.buildCondition(conditionGroup.right));
      }
    } else {
      // Right AND
      // eslint-disable-next-line no-lonely-if
      if (isConditionGroup(conditionGroup.right)) {
        paramsGroup.andGroup((rightGroup) => {
          this.buildGroup(rightGroup, conditionGroup.right as ConditionGroup);
        });
      } else {
        paramsGroup.andFilter(...this.buildCondition(conditionGroup.right));
      }
    }
  }

  private buildCondition(condition: Condition): QueryFilter<T> {
    const currentProperty = this.searchProperties.find((value) => value.label === condition.property);
    const mappedConditionProperty = (currentProperty?.property || condition.property);
    const mappedConditionValue = this.mapValueByPropertyType(currentProperty, condition);

    return [mappedConditionProperty, condition.comparator, mappedConditionValue] as QueryFilter<T>;
  }

  private mapValueByPropertyType(property: SearchProperty<T>, condition: Condition): LiteralValue | LiteralValue[] {
    if (property?.propertyType === PropertyType.Date) {
      return this.convertDateToMilliseconds(condition.value);
    }

    if (property?.propertyType === PropertyType.Memory) {
      return this.parseMemoryValue(property, condition.value);
    }

    return condition.value;
  }

  private convertDateToMilliseconds(value: LiteralValue | LiteralValue[]): number | number[] {
    const convertDate = (dateValue: LiteralValue): number => {
      const date = new Date(dateValue as string);
      if (Number.isNaN(date.getTime())) {
        return null;
      }
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    };

    if (Array.isArray(value)) {
      return value.map(convertDate);
    }
    return convertDate(value);
  }

  private parseMemoryValue(property: SearchProperty<T>, value: LiteralValue | LiteralValue[]): number | number[] {
    const parseValue = (memoryValue: LiteralValue): number => {
      return property.parseValue(memoryValue as string) as number;
    };

    if (Array.isArray(value)) {
      return value.map(parseValue);
    }
    return parseValue(value);
  }
}
