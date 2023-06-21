import pluginPkg from '../../package.json';

const pluginId = pluginPkg.name.replace(/strapi-/gm, "").replace(/-/gm, "");
console.log(pluginId);
export default pluginId;
