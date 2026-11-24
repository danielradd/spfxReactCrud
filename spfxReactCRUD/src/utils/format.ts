/** Replaces {0}, {1}… in a localized string with the given values. */
export function format(template: string, ...values: (string | number)[]): string {
  return template.replace(/\{(\d+)\}/g, (match: string, index: string) => {
    const value: string | number | undefined = values[Number(index)];
    return value === undefined ? match : String(value);
  });
}
