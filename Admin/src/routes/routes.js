import Dashboard from '../pages/Dashboard'
import AllUsers from '../pages/users/allUsers'
import Clients from '../pages/users/clients'
import ServiceProviders from '../pages/users/providers'
import Services from '../pages/services/Services'

export const routes = [
  {
    path: '/',
    element: Dashboard,
    name: 'Dashboard'
  },
  {
    path: '/users',
    element: AllUsers,
    name: 'All Users'
  },
  {
    path: '/users/clients',
    element: Clients,
    name: 'Clients'
  },
  {
    path: '/users/providers',
    element: ServiceProviders,
    name: 'Service Providers'
  },
  {
    path: '/services/services',
    element: Services,
    name: 'Services'
  }
]
