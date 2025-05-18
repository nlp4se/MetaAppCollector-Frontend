export interface MetricDashboardDTO {
  metric: {
    code: string;
    name: string;
    description: string;
    value_type: "string" | "integer" | "float" | "date" | "boolean";
  };
  sources: {
    source: string;
    history: {
      date: string;
      //value: string | number | Date | boolean;
      value: number;
    }[];
  }[];
}
