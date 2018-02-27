import { folderExists } from '../utils';

export = {
  description: 'Add an unconnected shared component',
  prompts:     [
    {
      type:     'input',
      name:     'name',
      message:  'What should it be called?',
      validate: (value: string) => {
        if (!value || value.length === 0) {
          return 'name is required';
        }

        return folderExists(value) ? `folder already exists (${value})` : true;
      },
    },
  ],
  actions:     (data: any) => {
    const path: string[] = data.name.split('/');

    data.componentName = path.pop();
    data.basePath = '../../src/app/shared/components' + path.join('/');

    return [
      {
        type:         'add',
        path:         '{{basePath}}/{{properCase componentName}}/{{properCase componentName}}.vue',
        templateFile: './shared-component/component.vue.hbs',
        abortOnFail:  true,
      },
      {
        type:         'add',
        path:         '{{basePath}}/{{properCase componentName}}/{{properCase componentName}}.spec.ts',
        templateFile: './shared-component/component.spec.ts.hbs',
        abortOnFail:  true,
      },
      {
        type:         'add',
        path:         '{{basePath}}/{{properCase componentName}}/{{properCase componentName}}.stories.ts',
        templateFile: './shared-component/component.stories.ts.hbs',
        abortOnFail:  true,
      },
    ];
  },
};
