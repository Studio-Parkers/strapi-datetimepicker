import type {Strapi} from "@strapi/strapi";

export default {
    register({strapi}: {strapi: Strapi})
    {
        strapi.customFields.register({
            name: "datetimepicker",
            plugin: "datetimepicker",
            type: "datetime"
        });
    }
};