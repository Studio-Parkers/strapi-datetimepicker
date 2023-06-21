import {prefixPluginTranslations} from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import getTrad from "./utils/getTrad";
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.registerPlugin({
        id: pluginId,
        initializer: Initializer,
        isReady: true,
        name,
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
                    value: "1",
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
                    value: "1",
                    intlLabel: {
                        id: getTrad("datetimepicker.options.minuteInterval"),
                        defaultMessage: "Minute intervals",
                    },
                    description: {
                        id: getTrad("datetimepicker.options.minuteInterval.description"),
                        defaultMessage: "The amount of minutes to progress in one step",
                    }
                }]
            }]
        }
    });
  },

  bootstrap(app: any) {},

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
