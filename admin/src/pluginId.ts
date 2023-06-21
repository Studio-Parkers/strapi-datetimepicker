import pluginPkg from '../../package.json';

const pluginId = pluginPkg.name.replace(/@strapi\//gm, "");
export default pluginId;
