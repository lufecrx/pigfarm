import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Manager',
    title: true
  },
  {
    name: 'Pig List',
    url: '/pig-list',
    iconComponent: { name: 'cil-notes' },
  },
  {
    name: 'Weight control',
    url: '/weight-control',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    name: 'Registration',
    url: '/registration',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Register Pigs',
        url: '/registration/register-pig',
      },
      {
        name: 'Register Weight',
        url: '/registration/register-weight',
      },
    ]
  },
  {
    title: true,
    name: 'Connect with me',
    class: 'py-0'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/lufecrx/pigfarm-angular',
    iconComponent: { name: 'cibGithub' },
    attributes: { target: '_blank', class: '-text-dark' },
    class: 'mt-auto'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/luizfelipecg/',
    iconComponent: { name: 'cibLinkedin' },
    attributes: { target: '_blank' }
  }
];
