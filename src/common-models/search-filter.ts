/**
 * OR condition on search criteria
 */
export class SearchFilter {
  field: string;
  value: string | number;
  /**
   * eq        - Equals.
   * finset    - A value within a set of values
   * from      - The beginning of a range. Must be used with to
   * gt        - Greater than
   * gteq      - Greater than or equal
   * in        - In. The value can contain a comma-separated list of values.
   * like      - Like. The value can contain the SQL wildcard characters when like is specified.
   * lt        - Less than
   * lteq      - Less than or equal
   * moreq     - More or equal
   * neq       - Not equal
   * nfinset   - A value that is not within a set of values
   * nin       - Not in. The value can contain a comma-separated list of values.
   * notnull   - Not null
   * null      - Null
   * to        - The end of a range. Must be used with from
   */
  condition_type?: ConditionType;

  constructor(field: string, value: string | number, condition_type?: ConditionType) {
    this.field = field;
    this.value = encodeURIComponent(value + '');
    this.condition_type = condition_type;
  }
}

/**
 * eq        - Equals.
 * finset    - A value within a set of values
 * from      - The beginning of a range. Must be used with to
 * gt        - Greater than
 * gteq      - Greater than or equal
 * in        - In. The value can contain a comma-separated list of values.
 * like      - Like. The value can contain the SQL wildcard characters when like is specified.
 * lt        - Less than
 * lteq      - Less than or equal
 * moreq     - More or equal
 * neq       - Not equal
 * nfinset   - A value that is not within a set of values
 * nin       - Not in. The value can contain a comma-separated list of values.
 * notnull   - Not null
 * null      - Null
 * to        - The end of a range. Must be used with from
 */
export type ConditionType = 'eq' | 'finset' | 'from' | 'gt' | 'gteq' | 'in'
  | 'like' | 'lt' | 'lteq' | 'moreq' | 'neq' | 'nfinset'
  | 'nin' | 'notnull' | 'null' | 'to';
