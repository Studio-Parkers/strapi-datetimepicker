import {prefixPluginTranslations} from "@strapi/helper-plugin";

// Lib
import pluginId from "./pluginId";
import getTrad from "./utils/getTrad";

// Components
import Initializer from "./components/Initializer";
import PluginIcon from "./components/PluginIcon";

import pluginPkg from "../../package.json";

const name = pluginPkg.strapi.name;

export default {
    register(app: any)
    {
        app.registerPlugin({
            name,
            id: pluginId,
            isReady: false,
            initializer: Initializer
        });

        app.customFields.register({
            name: "datetimepicker",
            pluginId: pluginId,
            type: "datetime",
            intlLabel: {
                id: getTrad("datetimepicker.label"),
                defaultMessage: "DateTimePicker",
            },
            intlDescription: {
                id: getTrad("datetimepicker.description"),
                defaultMessage: "A user-friendly datetime picker",
            },
            icon: PluginIcon,
            components: {
                Input: async ()=> import(/* webpackChunkName: "datetimepicker" */ "./components/Input"),
            },
            options: {
                base: [{
                    sectionTitle: {
                        id: "global.settings",
                        defaultMessage: "Settings",
                    },
                    items: [{
                        name: "options.hourInterval",
                        type: "number",
                        defaultValue: "1",
                        intlLabel: {
                            id: getTrad("datetimepicker.options.hourInterval"),
                            defaultMessage: "Hour intervals",
                        },
                        description: {
                            id: getTrad("datetimepicker.options.hourInterval.description"),
                            defaultMessage: "The amount of hours to progress in one step",
                        }
                    },
                    {
                        name: "options.minuteInterval",
                        type: "number",
                        defaultValue: "1",
                        intlLabel: {
                            id: getTrad("datetimepicker.options.minuteInterval"),
                            defaultMessage: "Minute intervals",
                        },
                        description: {
                            id: getTrad("datetimepicker.options.minuteInterval.description"),
                            defaultMessage: "The amount of minutes to progress in one step",
                        }
                    },
                    {
                        intlLabel: {
                            id: getTrad("datetimepicker.options.timeZone"),
                            defaultMessage: "Select a time zone"
                        },
                        name: "options.timeZone",
                        type: "select",
                        defaultValue: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        options: (Intl as any).supportedValuesOf("timeZone").map((timeZone: string)=> {
                            return {
                                key: timeZone.toLowerCase().replace(/[\/-]/gm, "_").replace(/\+/gm, ""),
                                value: timeZone,
                                metadatas: {
                                    intlLabel: {
                                        id: getTrad(`datetimepicker.options.timeZone.${timeZone.toLowerCase().replace(/[\/-]/gm, "_").replace(/\+/gm, "")}`),
                                        defaultMessage: timeZone,
                                    }
                                }
                            };
                        })
                    },
                    {
                        name: "options.locale",
                        type: "string",
                        defaultValue: "en-GB",
                        intlLabel: {
                            id: getTrad("datetimepicker.options.locale"),
                            defaultMessage: "Locale to use",
                        },
                        description: {
                            id: getTrad("datetimepicker.options.locale.description"),
                            defaultMessage: "The locale determines the format of the date (e.g. en-GB will result in d-m-Y)"
                        }
                    }]
                }]
            }
        });
    },

    bootstrap(app: any) {},

    async registerTrads(app: any)
    {
        const {locales} = app;

        const importedTrads = await Promise.all((locales as any[]).map((locale)=>
        {
            return import(`./translations/${locale}.json`)
                .then(({default: data})=>
                {
                    return {data: prefixPluginTranslations(data, pluginId), locale};
                })
                .catch(()=>
                {
                    return {data: {}, locale};
                });
        }));

        return Promise.resolve(importedTrads);
    }
};
