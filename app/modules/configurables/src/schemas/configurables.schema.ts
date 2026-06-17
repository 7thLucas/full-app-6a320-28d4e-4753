/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
      maxLength: 120,
    },
    {
      fieldName: "followUpDaysThreshold",
      type: "number",
      required: false,
      label: "Follow-up Overdue After (days)",
      min: 1,
      max: 60,
    },
    {
      fieldName: "verticals",
      type: "array",
      required: false,
      label: "Lead Verticals",
      item: { type: "string", required: true },
    },
    {
      fieldName: "statusColors",
      type: "object",
      required: false,
      label: "Interest Status Colors",
      fields: [
        { fieldName: "hot", type: "color", required: false, label: "Hot Color" },
        { fieldName: "warm", type: "color", required: false, label: "Warm Color" },
        { fieldName: "cold", type: "color", required: false, label: "Cold Color" },
      ],
    },
    {
      fieldName: "emptyStateMessage",
      type: "string",
      required: false,
      label: "Empty State Message",
      maxLength: 100,
    },
    {
      fieldName: "welcomeMessage",
      type: "string",
      required: false,
      label: "Welcome Message",
      maxLength: 200,
    },
  ],
};
