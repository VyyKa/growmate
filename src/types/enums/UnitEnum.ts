export const UnitEnum = {
  Kilogram: 'kilogram',
  Ton: 'ton',
} as const
export type UnitEnum = typeof UnitEnum[keyof typeof UnitEnum]
