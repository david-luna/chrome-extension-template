declare var global: any;

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export const mockChrome = (mockedChrome: DeepPartial<typeof chrome>) => {
  const initial = global.chrome;
  global.chrome = mockedChrome;

  return {
    restore: () => {
      global.chrome = initial;
    },
  };
};
