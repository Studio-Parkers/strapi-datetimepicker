import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
    strapi.customFields.register({
        name: "datetimepicker",
        plugin: "datetimepicker",
        type: "datetime"
    });
};
