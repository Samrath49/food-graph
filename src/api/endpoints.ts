const createApiEndpoint = (endpoint: string): string => {
  return `${"https://www.themealdb.com/api/json/v1/1/"}/${endpoint}`;
};

const endpoints = new Map([
  ["categories", createApiEndpoint("list.php?c=list")],
  ["ingredients", createApiEndpoint("list.php?i=list")],
  ["meals", createApiEndpoint("search.php?s=")],
  ["meal", createApiEndpoint("lookup.php?i=")],
  ["filter", createApiEndpoint("filter.php?c=")],
  ["random", createApiEndpoint("random.php")],
]);

export { endpoints };
