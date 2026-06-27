'use client';

import React from 'react';
import { MobileDock } from '@/components/MobileDock';
import * as Icons from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      {/* Page Content Container */}
      <div className="page-content pb-36" id="pageContent">
        
        {/* Hero Section */}
        <div className="hero">
          <div className="verified-badge">
            <Icons.CheckCircle className="w-3.5 h-3.5" />
            Verified Learning Platform
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] mb-2 leading-tight">
            Find Your Perfect Course from <span className="text-[var(--accent)] font-black">Top Institutes</span>
          </h1>
          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto">
            Discover verified courses from trusted educational institutions. Compare, enroll, and start your learning journey today.
          </p>
          
          <div className="edubird-search-wrapper mt-5">
            <Icons.Search className="w-5 h-5 text-[var(--text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              className="edubird-search" 
              placeholder="Search courses, institutes, or skills..." 
            />
          </div>
          <button 
            className="edubird-btn"
            onClick={() => {
              // Trigger search mock
              const toastEl = document.getElementById('toast');
              const toastText = document.getElementById('toastText');
              if (toastEl && toastText) {
                toastText.textContent = 'Searching courses...';
                toastEl.classList.add('visible');
                setTimeout(() => toastEl.classList.remove('visible'), 2500);
              }
            }}
          >
            Search Courses
          </button>

          {/* Stats Row */}
          <div className="stats-row mt-6">
            <div className="stat-item">
              <div className="stat-number">1,200+</div>
              <div className="stat-label">Active Courses</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50,000+</div>
              <div className="stat-label">Students Enrolled</div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="section-card">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-3">✨ Interactive Features</h3>
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-item-icon">
                <Icons.Expand className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="feature-item-title">Expand Dock</div>
              <div className="feature-item-desc">Tap center button or swipe up on handle</div>
            </div>
            <div className="feature-item">
              <div className="feature-item-icon">
                <Icons.Layers className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="feature-item-title">Nested Menus</div>
              <div className="feature-item-desc">iOS-style slide navigation with breadcrumbs</div>
            </div>
            <div className="feature-item">
              <div className="feature-item-icon">
                <Icons.Search className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="feature-item-title">Command Palette</div>
              <div className="feature-item-desc">Press ⌘K or long-press center button</div>
            </div>
            <div className="feature-item">
              <div className="feature-item-icon">
                <Icons.Palette className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="feature-item-title">Theme Picker</div>
              <div className="feature-item-desc">Dark/Light mode with red accent</div>
            </div>
            <div className="feature-item">
              <div className="feature-item-icon">
                <Icons.Music className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="feature-item-title">Mini Player</div>
              <div className="feature-item-desc">Floating music widget — hides on scroll</div>
            </div>
            <div className="feature-item">
              <div className="feature-item-icon">
                <Icons.Sparkles className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="feature-item-title">AI Assistant</div>
              <div className="feature-item-desc">Quick AI panel with suggestions</div>
            </div>
          </div>
        </div>

        {/* Gestures List */}
        <div className="section-card">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-3">🎯 Gestures</h3>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)]">
              <div className="w-9 h-9 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] flex items-center justify-center">
                <Icons.MousePointerClick className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">Tap Center Button</div>
                <div className="text-[11px] text-[var(--text-muted)]">Expands / Collapses dock</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)]">
              <div className="w-9 h-9 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] flex items-center justify-center">
                <Icons.ArrowUp className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">Swipe Up on Handle</div>
                <div className="text-[11px] text-[var(--text-muted)]">Expands dock</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)]">
              <div className="w-9 h-9 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] flex items-center justify-center">
                <Icons.ArrowDown className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">Swipe Down on Handle</div>
                <div className="text-[11px] text-[var(--text-muted)]">Collapses dock</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)]">
              <div className="w-9 h-9 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] flex items-center justify-center">
                <Icons.XCircle className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">Tap Outside</div>
                <div className="text-[11px] text-[var(--text-muted)]">Closes all menus & panels</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)]">
              <div className="w-9 h-9 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] flex items-center justify-center">
                <Icons.Hand className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">Long Press Center</div>
                <div className="text-[11px] text-[var(--text-muted)]">Opens quick actions radial menu</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)]">
              <div className="w-9 h-9 rounded-lg bg-[rgba(var(--accent-rgb),0.1)] flex items-center justify-center">
                <Icons.Zap className="w-[18px] h-[18px] text-[var(--accent)]" />
              </div>
              <div className="text-left">
                <div className="text-[13px] font-semibold text-[var(--text-primary)]">Double Tap</div>
                <div className="text-[11px] text-[var(--text-muted)]">Jump to Home</div>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="section-card">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-3">⌨️ Keyboard Shortcuts</h3>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center py-2 border-b border-[var(--glass-border)]">
              <span className="text-[13px] text-[var(--text-secondary)]">Command Palette</span>
              <span className="kbd">⌘K</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[var(--glass-border)]">
              <span className="text-[13px] text-[var(--text-secondary)]">Close Menus</span>
              <span className="kbd">ESC</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[var(--glass-border)]">
              <span className="text-[13px] text-[var(--text-secondary)]">Navigate Items</span>
              <span className="kbd">↑↓</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[13px] text-[var(--text-secondary)]">Select Item</span>
              <span className="kbd">Enter</span>
            </div>
          </div>
        </div>

        {/* Info & Static Theme triggers */}
        <div className="section-card">
          <h3 className="text-[16px] font-bold text-[var(--text-primary)] mb-3"> Theme Setup</h3>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            Dark mode: Black & Red. Light mode: White & Red. Toggle theme from the Settings card in the expanded dock menu, or try the quick buttons below.
          </p>
          <div className="flex gap-3 mt-4">
            <button 
              className="edubird-btn flex-1 !mt-0 py-2.5 text-[14px]"
              onClick={() => {
                document.documentElement.dataset.theme = 'dark';
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
                localStorage.setItem('app-theme', 'dark');
                // Trigger toast
                const toastEl = document.getElementById('toast');
                const toastText = document.getElementById('toastText');
                if (toastEl && toastText) {
                  toastText.textContent = 'Theme: dark';
                  toastEl.classList.add('visible');
                  setTimeout(() => toastEl.classList.remove('visible'), 2500);
                }
              }}
            >
              Dark Mode
            </button>
            <button 
              className="edubird-btn flex-1 !mt-0 py-2.5 text-[14px] bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-90"
              onClick={() => {
                document.documentElement.dataset.theme = 'light';
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
                localStorage.setItem('app-theme', 'light');
                // Trigger toast
                const toastEl = document.getElementById('toast');
                const toastText = document.getElementById('toastText');
                if (toastEl && toastText) {
                  toastText.textContent = 'Theme: light';
                  toastEl.classList.add('visible');
                  setTimeout(() => toastEl.classList.remove('visible'), 2500);
                }
              }}
            >
              Light Mode
            </button>
          </div>
        </div>

        {/* Height offset spacer to allow vertical scrolling */}
        <div className="h-[200px]" />
      </div>

      {/* Floating Reusable Mobile Dock Component */}
      <MobileDock />
    </div>
  );
}
