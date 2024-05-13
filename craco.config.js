/* eslint-disable @typescript-eslint/no-var-requires */
const CracoLessPlugin = require('craco-less');
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#417D8B',
              '@layout-header-background': '#211F30',
              '@layout-body-background': '#F2F8F5',
              '@btn-primary-color': '#F2F8F5',
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
// все переменные стилей тут:
// https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
// https://github.com/ant-design/ant-design/blob/4.x-stable/components/style/themes/default.less
