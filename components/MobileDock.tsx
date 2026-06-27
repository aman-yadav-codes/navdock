'use client';

import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper component to render icons dynamically from a string name
interface DynamicIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className, style }) => {
  // Convert standard kebab-case or general names to PascalCase for Lucide React
  const formatName = (str: string): string => {
    if (!str) return 'HelpCircle';
    // Special mappings
    if (str === 'folder-kanban') return 'FolderKanban';
    if (str === 'layout-grid') return 'LayoutGrid';
    if (str === 'file-text') return 'FileText';
    if (str === 'pen-tool') return 'PenTool';
    if (str === 'book-open') return 'BookOpen';
    if (str === 'chevron-left') return 'ChevronLeft';
    if (str === 'chevron-right') return 'ChevronRight';
    if (str === 'chevron-down') return 'ChevronDown';
    if (str === 'chevron-up') return 'ChevronUp';
    if (str === 'arrow-right') return 'ArrowRight';
    if (str === 'arrow-left') return 'ArrowLeft';
    if (str === 'x-circle') return 'XCircle';
    if (str === 'mouse-pointer-click') return 'MousePointerClick';
    
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  };

  const pascalName = formatName(name);
  const IconComponent = (Icons as any)[pascalName] || Icons.HelpCircle;
  return <IconComponent className={className} style={style} />;
};

// Reusable Magnetic Effect wrapper
interface MagneticProps {
  children: React.ReactElement;
  enabled?: boolean;
}

const Magnetic: React.FC<MagneticProps> = ({ children, enabled = true }) => {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.15, y: y * 0.15 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  // Clone element to apply ref and event handlers
  return React.cloneElement(children, {
    ref: (node: HTMLElement) => {
      ref.current = node;
      // Also invoke potential internal refs if they exist
      const { ref: childRef } = children as any;
      if (childRef) {
        if (typeof childRef === 'function') childRef(node);
        else childRef.current = node;
      }
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: {
      ...(children as any).props?.style,
      transform: offset.x || offset.y ? `translate(${offset.x}px, ${offset.y}px)` : undefined,
      transition: offset.x || offset.y ? 'none' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  } as any);
};

// Interfaces for component customizability
export interface DockItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  hasSubmenu?: boolean;
  submenu?: string;
  badge?: string;
  color?: string; // used for social/workspace
  pinned?: boolean; // used for workspace
}

export interface MenuCardSection {
  title: string;
  icon: string;
  subtitle: string;
  type: 'list' | 'action' | 'grid' | 'theme' | 'social' | 'workspace';
  items: MenuItem[];
}

export interface SubmenuSection {
  title: string;
  items: MenuItem[];
}

interface MobileDockProps {
  dockItems?: DockItem[];
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  menuSections?: Record<string, MenuCardSection>;
  submenus?: Record<string, SubmenuSection>;
}

// Default items and configuration matching abc.html design
const defaultDockItems: DockItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'about', label: 'About', icon: 'user' },
  { id: 'projects', label: 'Projects', icon: 'folder-kanban', badge: 3 },
  { id: 'contact', label: 'Contact', icon: 'send' },
];

const defaultMenuSections: Record<string, MenuCardSection> = {
  projects: {
    title: 'Projects',
    icon: 'folder-kanban',
    subtitle: '5 items',
    type: 'list',
    items: [
      { id: 'all', label: 'All Projects', icon: 'layout-grid', hasSubmenu: true, submenu: 'all-projects' },
      { id: 'web', label: 'Web Apps', icon: 'globe', hasSubmenu: true, submenu: 'web-apps' },
      { id: 'mobile', label: 'Mobile Apps', icon: 'smartphone', hasSubmenu: true, submenu: 'mobile-apps' },
      { id: 'ui', label: 'UI/UX Designs', icon: 'palette', hasSubmenu: true, submenu: 'ui-designs' },
      { id: 'case', label: 'Case Studies', icon: 'file-text', hasSubmenu: true, submenu: 'case-studies' },
    ]
  },
  quickActions: {
    title: 'Quick Actions',
    icon: 'zap',
    subtitle: 'Fast access',
    type: 'action',
    items: [
      { id: 'resume', label: 'Open Resume', icon: 'file-text' },
      { id: 'cv', label: 'Download CV', icon: 'download' },
      { id: 'call', label: 'Schedule Call', icon: 'calendar' },
      { id: 'email', label: 'Send Email', icon: 'mail' },
    ]
  },
  tools: {
    title: 'Tools',
    icon: 'wrench',
    subtitle: 'Utilities',
    type: 'grid',
    items: [
      { id: 'code', label: 'Code Sandbox', icon: 'code' },
      { id: 'blog', label: 'Blog', icon: 'pen-tool' },
      { id: 'snippets', label: 'Snippets', icon: 'scissors' },
      { id: 'resources', label: 'Resources', icon: 'book-open' },
    ]
  },
  settings: {
    title: 'Settings',
    icon: 'settings',
    subtitle: 'Customize',
    type: 'theme',
    items: [
      { id: 'theme-dark', label: 'Dark Mode', icon: 'moon' },
      { id: 'theme-light', label: 'Light Mode', icon: 'sun' },
    ]
  },
  social: {
    title: 'Connect',
    icon: 'users',
    subtitle: 'Social links',
    type: 'social',
    items: [
      { id: 'github', label: 'GitHub', icon: 'github', color: '#f0f0f0' },
      { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', color: '#0077B5' },
      { id: 'twitter', label: 'Twitter', icon: 'twitter', color: '#1DA1F2' },
      { id: 'email', label: 'Email', icon: 'mail', color: '#EA4335' },
    ]
  },
  workspace: {
    title: 'Workspace',
    icon: 'briefcase',
    subtitle: 'Recent & pinned',
    type: 'workspace',
    items: [
      { id: 'recent1', label: 'Smart Dock v2', color: '#DC2626', pinned: true },
      { id: 'recent2', label: 'Portfolio Redesign', color: '#EF4444', pinned: true },
      { id: 'recent3', label: 'AI Dashboard', color: '#B91C1C', pinned: false },
      { id: 'recent4', label: 'E-Commerce App', color: '#991B1B', pinned: false },
    ]
  }
};

const defaultSubmenus: Record<string, SubmenuSection> = {
  'web-apps': {
    title: 'Web Apps',
    items: [
      { id: 'ecommerce', label: 'E-Commerce', icon: 'shopping-cart', hasSubmenu: true, submenu: 'ecommerce-sub' },
      { id: 'saas', label: 'SaaS Platform', icon: 'cloud', hasSubmenu: true, submenu: 'saas-sub' },
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
      { id: 'landing', label: 'Landing Pages', icon: 'globe' },
    ]
  },
  'all-projects': {
    title: 'All Projects',
    items: [
      { id: 'p1', label: 'Smart Dock', icon: 'dock', badge: 'New' },
      { id: 'p2', label: 'AI Assistant', icon: 'sparkles' },
      { id: 'p3', label: 'Design System', icon: 'palette', badge: '3' },
      { id: 'p4', label: 'Mobile App', icon: 'smartphone' },
    ]
  },
  'mobile-apps': {
    title: 'Mobile Apps',
    items: [
      { id: 'ios', label: 'iOS App', icon: 'smartphone' },
      { id: 'android', label: 'Android App', icon: 'smartphone' },
      { id: 'flutter', label: 'Flutter App', icon: 'code' },
    ]
  },
  'ui-designs': {
    title: 'UI/UX Designs',
    items: [
      { id: 'figma', label: 'Figma Files', icon: 'figma' },
      { id: 'prototypes', label: 'Prototypes', icon: 'layers' },
      { id: 'components', label: 'Components', icon: 'component' },
    ]
  },
  'case-studies': {
    title: 'Case Studies',
    items: [
      { id: 'cs1', label: 'E-Commerce Redesign', icon: 'file-text' },
      { id: 'cs2', label: 'SaaS Onboarding', icon: 'file-text' },
      { id: 'cs3', label: 'Mobile Banking', icon: 'file-text' },
    ]
  },
  'ecommerce-sub': {
    title: 'E-Commerce',
    items: [
      { id: 'shop1', label: 'Fashion Store', icon: 'shopping-bag' },
      { id: 'shop2', label: 'Tech Store', icon: 'shopping-bag' },
      { id: 'shop3', label: 'Food Delivery', icon: 'shopping-bag' },
    ]
  },
  'saas-sub': {
    title: 'SaaS Platform',
    items: [
      { id: 'saas1', label: 'Analytics Dashboard', icon: 'bar-chart' },
      { id: 'saas2', label: 'CRM System', icon: 'users' },
      { id: 'saas3', label: 'Project Manager', icon: 'kanban' },
    ]
  }
};

export const MobileDock: React.FC<MobileDockProps> = ({
  dockItems = defaultDockItems,
  defaultActiveTab = 'home',
  onTabChange,
  menuSections = defaultMenuSections,
  submenus = defaultSubmenus,
}) => {
  // Global States
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [accent, setAccentState] = useState('red');
  const [isPlaying, setIsPlaying] = useState(true);
  const [dockHidden, setDockHidden] = useState(false);
  const [playerHidden, setPlayerHidden] = useState(false);
  const [scrollHintVisible, setScrollHintVisible] = useState(false);

  // Dynamic Panels visibility
  const [radialVisible, setRadialVisible] = useState(false);
  const [aiPanelVisible, setAiPanelVisible] = useState(false);
  const [commandPaletteVisible, setCommandPaletteVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; item: DockItem | null }>({
    visible: false,
    x: 0,
    y: 0,
    item: null,
  });
  
  // Toast notifications state
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });
  
  // Drawer stacks for submenus
  const [submenuStack, setSubmenuStack] = useState<Array<{ id: string; title: string; items: MenuItem[] }>>([]);
  const [commandSearchText, setCommandSearchText] = useState('');

  // Refs for tracking gestures/scrolling
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const lastTapRef = useRef(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);

  // Show Toast
  const showToast = (message: string) => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ visible: true, message });
    toastTimeout.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 2500);
  };

  // Switch tabs
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
    
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }

    // Floating mini player displays only on 'home' tab and if not scrolled
    if (tabId === 'home' && !playerHidden) {
      setPlayerHidden(false);
    } else {
      setPlayerHidden(true);
    }
    showToast(`Switched to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
  };

  // Toggle play/pause for mini player
  const togglePlay = () => {
    setIsPlaying(prev => {
      const next = !prev;
      showToast(next ? 'Playing' : 'Paused');
      return next;
    });
  };

  // Toggle main dock cards expansion
  const toggleDock = () => {
    setExpanded(prev => {
      const next = !prev;
      if (next) {
        showToast('Dock expanded');
      } else {
        closeAllPanels();
      }
      return next;
    });
  };

  // Close all open menus, palettes, context overlay
  const closeAllPanels = () => {
    setSubmenuStack([]);
    setCommandPaletteVisible(false);
    setRadialVisible(false);
    setAiPanelVisible(false);
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  // Submenu handler
  const handleMenuItem = (cardKey: string, item: MenuItem) => {
    if (item.hasSubmenu && item.submenu && submenus[item.submenu]) {
      const sub = submenus[item.submenu];
      setSubmenuStack(prev => [...prev, { id: item.submenu!, title: sub.title, items: sub.items }]);
    } else {
      showToast(`Opened ${item.label}`);
    }
  };

  // Navigate breadcrumbs inside submenu drawer
  const goToBreadcrumb = (index: number) => {
    if (index === 0) {
      setSubmenuStack([]);
    } else {
      setSubmenuStack(prev => prev.slice(0, index));
    }
  };

  // Theme selector
  const toggleTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    document.documentElement.classList.toggle('dark', t === 'dark');
    document.documentElement.style.colorScheme = t;
    localStorage.setItem('app-theme', t);
    showToast(`Theme: ${t}`);
  };

  // Accent selector
  const changeAccent = (acc: string) => {
    setAccentState(acc);
    const colors: Record<string, string> = {
      'red': '#DC2626',
      'red-light': '#EF4444',
      'red-dark': '#B91C1C'
    };
    const rgbColors: Record<string, string> = {
      'red': '220, 38, 38',
      'red-light': '239, 68, 68',
      'red-dark': '185, 28, 28'
    };
    const color = colors[acc] || '#DC2626';
    const rgb = rgbColors[acc] || '220, 38, 38';

    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-light', acc === 'red-dark' ? '#DC2626' : '#F87171');
    document.documentElement.style.setProperty('--accent-rgb', rgb);
    document.documentElement.style.setProperty('--glow-color', `rgba(${rgb}, 0.3)`);
    showToast(`Accent: ${acc}`);
  };

  // Executing command options
  const executeCommand = (cmd: string) => {
    setCommandPaletteVisible(false);
    const messages: Record<string, string> = {
      home: 'Navigated to Home',
      projects: 'Opening Projects',
      theme: 'Opening Theme Settings',
      search: 'Opening Search',
      about: 'Navigated to About',
      contact: 'Opening Contact',
      settings: 'Opening Settings'
    };
    showToast(messages[cmd] || 'Command executed');
    if (cmd === 'home' || cmd === 'about' || cmd === 'projects' || cmd === 'contact') {
      handleTabChange(cmd);
    }
  };

  // Context Menu Actions
  const handleContextAction = (action: string) => {
    const messages: Record<string, string> = {
      pin: 'Pinned to Dock!',
      favorite: 'Added to favorites!',
      share: 'Shared!',
      remove: 'Removed'
    };
    showToast(messages[action] || 'Action completed');
    setContextMenu({ visible: false, x: 0, y: 0, item: null });
  };

  // Scroll listener for auto hiding dock & music player on mobile viewports
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const isScrollingDown = currentScroll > lastScrollY.current;

      if (isScrollingDown && currentScroll > 80) {
        setDockHidden(true);
        setPlayerHidden(true);
        setScrollHintVisible(true);
      } else {
        setDockHidden(false);
        if (activeTab === 'home') {
          setPlayerHidden(false);
        }
        setScrollHintVisible(false);
      }
      lastScrollY.current = currentScroll;

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setScrollHintVisible(false);
      }, 2000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Offline/Online triggers
    const handleOnline = () => showToast('Back online');
    const handleOffline = () => showToast('Offline mode');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load: show music player after 1.5s delay if on home page
    const initialPlayerTimer = setTimeout(() => {
      if (activeTab === 'home') {
        setPlayerHidden(false);
      }
    }, 1500);

    const initialScrollHintTimer = setTimeout(() => {
      setScrollHintVisible(true);
      const hideHint = setTimeout(() => setScrollHintVisible(false), 4000);
      return () => clearTimeout(hideHint);
    }, 3000);

    // Load initial theme settings
    const storedTheme = localStorage.getItem('app-theme') as 'dark' | 'light' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    toggleTheme(initialTheme);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(initialPlayerTimer);
      clearTimeout(initialScrollHintTimer);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
    };
  }, [activeTab]);

  // Handle keyboard shortcuts (⌘K command palette, Escape close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteVisible(prev => {
          const next = !prev;
          if (next) setTimeout(() => document.getElementById('commandSearch')?.focus(), 100);
          return next;
        });
      }
      if (e.key === 'Escape') {
        closeAllPanels();
        setExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Long press helper for buttons (context menus)
  const startLongPress = (e: React.TouchEvent | React.MouseEvent, item: DockItem) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    longPressTimer.current = setTimeout(() => {
      setContextMenu({
        visible: true,
        x: clientX,
        y: clientY,
        item,
      });
    }, 500);
  };

  const endLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  // Touch Swipe Up/Down Drag Handle triggers toggleDock
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = touchStartY.current - e.touches[0].clientY;
    if (diff > 30 && !expanded) {
      setExpanded(true);
      showToast('Dock expanded');
      isDragging.current = false;
    } else if (diff < -30 && expanded) {
      setExpanded(false);
      isDragging.current = false;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Center button press and double tap detection
  const handleCenterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      handleTabChange('home');
      if (expanded) setExpanded(false);
      return;
    }
    lastTapRef.current = now;
    toggleDock();
  };

  // AI assistant long press or double tap trigger
  const handleDoubleTapProjects = (e: React.MouseEvent) => {
    let lastTap = (e.currentTarget as any).lastTap || 0;
    const now = Date.now();
    if (now - lastTap < 400) {
      setAiPanelVisible(true);
    }
    (e.currentTarget as any).lastTap = now;
  };

  // Radial menu item actions
  const radialActions = [
    { icon: 'search', label: 'Search', action: () => setCommandPaletteVisible(true) },
    { icon: 'sparkles', label: 'AI', action: () => setAiPanelVisible(true) },
    { icon: 'pin', label: 'Pin', action: () => showToast('Pinned to home') },
    { icon: 'star', label: 'Favorite', action: () => showToast('Added to favorites') },
    { icon: 'share-2', label: 'Share', action: () => showToast('Shared successfully') },
  ];

  return (
    <>
      {/* Background/ambient glow behind dock */}
      <div className={cn("ambient-glow", expanded && "expanded")} id="ambientGlow" />

      {/* Floating toast notification */}
      <div className={cn("toast", toast.visible && "visible")} id="toast">
        <Icons.CheckCircle className="w-4 h-4 text-[var(--accent)]" />
        <span id="toastText">{toast.message}</span>
      </div>

      {/* Scroll indicator hint at top right */}
      <div className={cn("scroll-hint", scrollHintVisible && "visible")} id="scrollHint">
        Scroll down to hide dock
      </div>

      {/* Main card overlays above dock */}
      {expanded && (
        <>
          <div className="menu-overlay visible" onClick={() => setExpanded(false)} />
          <div className="menu-cards" id="menuCards">
            {Object.entries(menuSections).map(([key, section], index) => (
              <div
                key={key}
                className={cn("menu-card visible", `stagger-${index + 1}`)}
                role="button"
                aria-label={`${section.title} menu`}
              >
                <div className="menu-card-header">
                  <div className="menu-card-icon">
                    <DynamicIcon name={section.icon} />
                  </div>
                  <div>
                    <div className="menu-card-title">{section.title}</div>
                    <div className="menu-card-subtitle">{section.subtitle}</div>
                  </div>
                </div>

                {section.type === 'list' && (
                  <>
                    {section.items.map(item => (
                      <div
                        key={item.id}
                        className="menu-item text-left"
                        onClick={() => handleMenuItem(key, item)}
                        role="button"
                        tabIndex={0}
                      >
                        {item.icon && (
                          <div className="menu-item-icon">
                            <DynamicIcon name={item.icon} />
                          </div>
                        )}
                        <span className="menu-item-text">{item.label}</span>
                        {item.badge && <span className="menu-item-badge">{item.badge}</span>}
                        {item.hasSubmenu && <Icons.ChevronRight className="menu-item-arrow w-4 h-4" />}
                      </div>
                    ))}
                    <div className="view-all-btn" onClick={() => showToast(`Viewing all ${section.title}`)}>
                      <span>View All</span>
                      <Icons.ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </>
                )}

                {section.type === 'action' && (
                  <>
                    {section.items.map(item => (
                      <div
                        key={item.id}
                        className="action-btn text-left"
                        onClick={() => showToast(`${item.label} clicked`)}
                      >
                        <DynamicIcon name={item.icon || 'HelpCircle'} className="w-[18px] h-[18px]" />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </>
                )}

                {section.type === 'grid' && (
                  <div className="grid-card">
                    {section.items.map(item => (
                      <div
                        key={item.id}
                        className="grid-item text-center"
                        onClick={() => showToast(`${item.label} opened`)}
                      >
                        <div className="grid-item-icon">
                          <DynamicIcon name={item.icon || 'HelpCircle'} className="w-[18px] h-[18px]" />
                        </div>
                        <span className="grid-item-label">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'theme' && (
                  <div className="text-left">
                    <div className="text-[12px] text-[var(--text-muted)] mb-2 font-semibold">Theme Mode</div>
                    <div
                      className={cn("theme-option", theme === 'dark' && "active")}
                      onClick={() => toggleTheme('dark')}
                    >
                      <div className="theme-swatch" style={{ background: '#09090b' }} />
                      <span className="text-[13px] text-[var(--text-primary)]">Dark</span>
                    </div>
                    <div
                      className={cn("theme-option", theme === 'light' && "active")}
                      onClick={() => toggleTheme('light')}
                    >
                      <div className="theme-swatch" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.1)' }} />
                      <span className="text-[13px] text-[var(--text-primary)]">Light</span>
                    </div>
                    <div className="text-[12px] text-[var(--text-muted)] mt-3 mb-2 font-semibold">Accent Color</div>
                    <div className="flex gap-2 flex-wrap">
                      <div
                        className={cn("accent-dot", accent === 'red' && "active")}
                        style={{ background: '#DC2626' }}
                        onClick={() => changeAccent('red')}
                      />
                      <div
                        className={cn("accent-dot", accent === 'red-light' && "active")}
                        style={{ background: '#EF4444' }}
                        onClick={() => changeAccent('red-light')}
                      />
                      <div
                        className={cn("accent-dot", accent === 'red-dark' && "active")}
                        style={{ background: '#B91C1C' }}
                        onClick={() => changeAccent('red-dark')}
                      />
                    </div>
                  </div>
                )}

                {section.type === 'social' && (
                  <div className="flex flex-col gap-2 text-left">
                    {section.items.map(item => (
                      <div
                        key={item.id}
                        className="social-btn text-left"
                        onClick={() => showToast(`Opening ${item.label}...`)}
                      >
                        <div className="social-icon" style={{ background: item.color ? item.color + '15' : 'rgba(255,255,255,0.05)', color: item.color }}>
                          {item.icon && <DynamicIcon name={item.icon} className="w-4 h-4" />}
                        </div>
                        <span className="text-[13px] font-medium text-[var(--text-primary)]">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'workspace' && (
                  <div className="flex flex-col gap-2 text-left">
                    {section.items.map(item => (
                      <div
                        key={item.id}
                        className="workspace-item text-left"
                        onClick={() => showToast(`Opened workspace: ${item.label}`)}
                      >
                        <div className="workspace-dot" style={{ background: item.color || 'var(--accent)' }} />
                        <span className="text-[13px] font-medium text-[var(--text-primary)] flex-1">{item.label}</span>
                        {item.pinned && <Icons.Pin className="w-3.5 h-3.5 text-[var(--text-muted)] rotate-45" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Slide-out Submenu drawer */}
      {submenuStack.length > 0 && (
        <>
          <div className="submenu-overlay visible" onClick={() => setSubmenuStack([])} />
          <div className="submenu-panel visible">
            <div className="submenu-header">
              <div
                className="submenu-back"
                onClick={() => {
                  if (submenuStack.length > 1) {
                    setSubmenuStack(prev => prev.slice(0, prev.length - 1));
                  } else {
                    setSubmenuStack([]);
                  }
                }}
              >
                <Icons.ChevronLeft className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="submenu-title">
                {submenuStack[submenuStack.length - 1].title}
              </div>
            </div>

            {/* Breadcrumb path navigation */}
            <div className="breadcrumb">
              {submenuStack.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && <span className="breadcrumb-sep">/</span>}
                  <span className="breadcrumb-item" onClick={() => goToBreadcrumb(index)}>
                    {item.title}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Items inside submenu */}
            <div id="submenuContent">
              {submenuStack[submenuStack.length - 1].items.map(item => (
                <div
                  key={item.id}
                  className="menu-item text-left"
                  onClick={() => {
                    if (item.hasSubmenu && item.submenu && submenus[item.submenu]) {
                      const sub = submenus[item.submenu];
                      setSubmenuStack(prev => [...prev, { id: item.submenu!, title: sub.title, items: sub.items }]);
                    } else {
                      showToast(item.label);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {item.icon && (
                    <div className="menu-item-icon">
                      <DynamicIcon name={item.icon} />
                    </div>
                  )}
                  <span className="menu-item-text">{item.label}</span>
                  {item.badge && <span className="menu-item-badge">{item.badge}</span>}
                  {item.hasSubmenu && <Icons.ChevronRight className="menu-item-arrow w-4 h-4" />}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Music Mini Player - floating on Home tab */}
      <div className={cn("mini-player", !playerHidden && activeTab === 'home' && "visible", playerHidden && "hidden-player")} id="miniPlayer">
        <div className="mini-player-art">
          <Icons.Music className="w-5 h-5 text-white" />
        </div>
        <div className="mini-player-info text-left">
          <div className="mini-player-title truncate">Building the Future</div>
          <div className="mini-player-artist truncate text-[11px] text-[var(--text-muted)]">Smart Dock • Now Playing</div>
        </div>
        <div className="mini-player-controls">
          <div className="mini-player-btn" onClick={() => showToast('Previous track')}>
            <Icons.SkipBack className="w-3.5 h-3.5 text-[var(--text-primary)]" />
          </div>
          <div className="mini-player-btn" id="playBtn" onClick={togglePlay}>
            {isPlaying ? (
              <Icons.Pause className="w-3.5 h-3.5 text-[var(--accent)]" />
            ) : (
              <Icons.Play className="w-3.5 h-3.5 text-[var(--accent)]" />
            )}
          </div>
          <div className="mini-player-btn" onClick={() => showToast('Next track')}>
            <Icons.SkipForward className="w-3.5 h-3.5 text-[var(--text-primary)]" />
          </div>
        </div>
      </div>

      {/* AI Assistant panel */}
      {aiPanelVisible && (
        <>
          <div className="ai-panel-overlay visible" onClick={() => setAiPanelVisible(false)} />
          <div className="ai-panel visible">
            <div className="flex items-center gap-2 mb-3.5 text-left">
              <div className="w-8 h-8 rounded-[10px] bg-[rgba(var(--accent-rgb),0.15)] flex items-center justify-center">
                <Icons.Sparkles className="w-4 h-4 text-[var(--accent)]" />
              </div>
              <span className="text-[16px] font-bold text-[var(--text-primary)]">AI Assistant</span>
            </div>
            <input className="ai-input" placeholder="Ask me anything..." id="aiInput" />
            <div className="ai-suggestions">
              <div className="ai-chip" onClick={() => showToast('Generating summary...')}>
                Summarize
              </div>
              <div className="ai-chip" onClick={() => showToast('Finding projects...')}>
                🔍 Find projects
              </div>
              <div className="ai-chip" onClick={() => showToast('Drafting message...')}>
                ✉️ Draft email
              </div>
              <div className="ai-chip" onClick={() => showToast('Creating task...')}>
                ✅ Create task
              </div>
            </div>
          </div>
        </>
      )}

      {/* Command Palette search modal */}
      {commandPaletteVisible && (
        <>
          <div className="menu-overlay visible" onClick={() => setCommandPaletteVisible(false)} />
          <div className="command-palette visible">
            <div className="p-4 pb-0">
              <div className="search-wrapper">
                <Icons.Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  className="search-input mb-0"
                  placeholder="Type a command or search..."
                  id="commandSearch"
                  value={commandSearchText}
                  onChange={(e) => setCommandSearchText(e.target.value)}
                />
              </div>
            </div>
            <div className="p-4 pt-2 max-h-[50vh] overflow-y-auto text-left">
              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider my-3 font-semibold">
                Actions
              </div>
              {[
                { id: 'home', label: 'Go to Home', icon: 'Home', shortcut: '⌘H' },
                { id: 'projects', label: 'Open Projects', icon: 'Folder', shortcut: '⌘P' },
                { id: 'theme', label: 'Change Theme', icon: 'Palette', shortcut: null },
                { id: 'search', label: 'Search Courses', icon: 'Search', shortcut: '⌘S' },
              ]
                .filter(item => item.label.toLowerCase().includes(commandSearchText.toLowerCase()))
                .map(item => (
                  <div
                    key={item.id}
                    className="menu-item"
                    onClick={() => executeCommand(item.id)}
                  >
                    <div className="menu-item-icon">
                      <DynamicIcon name={item.icon} />
                    </div>
                    <span className="menu-item-text">{item.label}</span>
                    {item.shortcut && <span className="kbd">{item.shortcut}</span>}
                  </div>
                ))}

              <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mt-4 mb-2 font-semibold">
                Navigation
              </div>
              {[
                { id: 'about', label: 'About Section', icon: 'User' },
                { id: 'contact', label: 'Contact', icon: 'Mail' },
                { id: 'settings', label: 'Settings', icon: 'Settings', shortcut: '⌘,' },
              ]
                .filter(item => item.label.toLowerCase().includes(commandSearchText.toLowerCase()))
                .map(item => (
                  <div
                    key={item.id}
                    className="menu-item"
                    onClick={() => executeCommand(item.id)}
                  >
                    <div className="menu-item-icon">
                      <DynamicIcon name={item.icon} />
                    </div>
                    <span className="menu-item-text">{item.label}</span>
                    {item.shortcut && <span className="kbd">{item.shortcut}</span>}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Radial action pop-out menu from Center button */}
      {radialVisible && (
        <>
          <div className="menu-overlay visible" onClick={() => setRadialVisible(false)} />
          <div className="radial-menu" style={{ transform: 'translateX(-50%)' }}>
            {radialActions.map((action, i) => {
              const radius = 80;
              const angle = (Math.PI * 2 * i) / radialActions.length - Math.PI / 2;
              const x = Math.cos(angle) * radius - 22;
              const y = Math.sin(angle) * radius - 22;

              return (
                <div
                  key={i}
                  className="radial-item visible"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                  }}
                  title={action.label}
                  onClick={() => {
                    action.action();
                    setRadialVisible(false);
                  }}
                >
                  <DynamicIcon name={action.icon} />
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Floating Context Menu (long press on buttons) */}
      {contextMenu.visible && (
        <>
          <div className="menu-overlay visible" onClick={() => setContextMenu({ visible: false, x: 0, y: 0, item: null })} />
          <div
            className="context-menu visible"
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y - 120}px`, // position slightly offset above the touch
            }}
          >
            <div className="context-item text-left" onClick={() => handleContextAction('pin')}>
              <Icons.Pin className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>Pin to Dock</span>
            </div>
            <div className="context-item text-left" onClick={() => handleContextAction('favorite')}>
              <Icons.Star className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>Add to Favorites</span>
            </div>
            <div className="context-item text-left" onClick={() => handleContextAction('share')}>
              <Icons.Share2 className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>Share</span>
            </div>
            <div className="context-item danger text-left" onClick={() => handleContextAction('remove')}>
              <Icons.Trash2 className="w-4 h-4 text-[var(--accent)]" />
              <span>Remove</span>
            </div>
          </div>
        </>
      )}

      {/* Fixed bottom Dock Bar */}
      <div className={cn("dock-container", dockHidden && "hidden-dock")} id="dockContainer">
        <div className="dock" id="dock" role="navigation" aria-label="Main navigation dock">
          {/* Drag Handle */}
          <div
            className="drag-handle"
            id="dragHandle"
            role="button"
            aria-label="Drag to expand dock"
            tabIndex={0}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* Left Buttons (Tab switching) */}
          {dockItems.slice(0, 2).map((item) => (
            <Magnetic key={item.id}>
              <div
                className={cn("dock-btn", activeTab === item.id && "active")}
                onClick={() => handleTabChange(item.id)}
                onMouseDown={(e) => startLongPress(e, item)}
                onMouseUp={endLongPress}
                onMouseLeave={endLongPress}
                onTouchStart={(e) => startLongPress(e, item)}
                onTouchEnd={endLongPress}
                role="button"
                aria-label={item.label}
                tabIndex={0}
              >
                <DynamicIcon name={item.icon} className="dock-icon" />
                <span className="dock-btn-label">{item.label}</span>
              </div>
            </Magnetic>
          ))}

          {/* Center Button */}
          <Magnetic>
            <div
              className="center-btn"
              id="centerBtn"
              onClick={handleCenterClick}
              onMouseDown={(e) => {
                longPressTimer.current = setTimeout(() => {
                  setRadialVisible(true);
                }, 600);
              }}
              onMouseUp={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
              onMouseLeave={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
              onTouchStart={(e) => {
                longPressTimer.current = setTimeout(() => {
                  setRadialVisible(true);
                }, 600);
              }}
              onTouchEnd={() => { if (longPressTimer.current) clearTimeout(longPressTimer.current); }}
              role="button"
              aria-label="Expand dock menu"
              tabIndex={0}
            >
              <Icons.Plus
                className={cn(
                  "dock-icon w-6 h-6 transition-transform duration-300 text-white",
                  expanded && "rotate-45"
                )}
              />
            </div>
          </Magnetic>

          {/* Right Buttons (Tab switching) */}
          {dockItems.slice(2).map((item) => (
            <Magnetic key={item.id}>
              <div
                className={cn("dock-btn", activeTab === item.id && "active")}
                onClick={(e) => {
                  handleTabChange(item.id);
                  if (item.id === 'projects') handleDoubleTapProjects(e);
                }}
                onMouseDown={(e) => startLongPress(e, item)}
                onMouseUp={endLongPress}
                onMouseLeave={endLongPress}
                onTouchStart={(e) => startLongPress(e, item)}
                onTouchEnd={endLongPress}
                role="button"
                aria-label={item.label}
                tabIndex={0}
                style={{ position: 'relative' }}
              >
                <DynamicIcon name={item.icon} className="dock-icon" />
                <span className="dock-btn-label">{item.label}</span>
                {item.badge && <div className="notif-badge">{item.badge}</div>}
              </div>
            </Magnetic>
          ))}
        </div>
      </div>
    </>
  );
};
