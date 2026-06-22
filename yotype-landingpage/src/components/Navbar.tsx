"use client";

import React from "react";

import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav} data-testid="nav-bar">
      <div className={styles.navBrand} data-testid="nav-brand">
        <div className={styles.brandIcon} aria-hidden="true"></div>
        <span>Intento</span>
      </div>
      <div className={styles.navLinks} data-testid="nav-links">
        <a href="#features" data-testid="nav-link-features">Features</a>
        <a href="#use-cases" data-testid="nav-link-use-cases">Use Cases</a>
        <a href="#commands" data-testid="nav-link-commands">Commands</a>
        <a href="#pricing" data-testid="nav-link-pricing">Pricing</a>
      </div>
      <a href="#download" className={styles.navCta} data-testid="nav-download-btn">
        Download
      </a>
    </nav>
  );
}
