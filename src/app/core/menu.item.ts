export interface MenuItem {
    path: string;
    label: string;
    icon?: string;
    children?: MenuItem[];
    isActive?: boolean;
    isDisabled?: boolean;
}

export const menuItems: MenuItem[] = [
    { path: 'dashboard', label: 'Dashboard', icon: '/assets/icons/Dashboard.svg' },
    { path: 'invoices', label: 'Invoices', icon: '/assets/icons/Document.svg' },
    { path: 'learners', label: 'Learners', icon: '/assets/icons/People.svg' },
    { path: 'tracks', label: 'Tracks', icon: '/assets/icons/Hat.svg', },
    { path: 'courses', label: 'Courses', icon: '/assets/icons/Hat.svg' },
    { path: 'reports', label: 'Reports', icon: '/assets/icons/Dashboard.svg' }

]