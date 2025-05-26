#!/usr/bin/env python3
"""
Script to automatically add mobile navigation support to all HTML files
"""

import os
import re
from pathlib import Path

def update_html_file(file_path):
    """Update a single HTML file with mobile navigation support"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Check if mobile-nav.js is already included
        if 'mobile-nav.js' in content:
            print(f"✓ {file_path.name} already has mobile navigation")
            return False
            
        # 1. Ensure proper viewport meta tag
        viewport_pattern = r'<meta name="viewport"[^>]*>'
        if not re.search(viewport_pattern, content):
            # Add viewport meta tag after charset
            charset_pattern = r'(<meta charset="[^"]*">)'
            if re.search(charset_pattern, content):
                content = re.sub(
                    charset_pattern,
                    r'\1\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                    content
                )
        
        # 2. Add mobile-nav.js script tag after navbar script
        navbar_script_pattern = r'(<script>[\s\S]*?fetch\([\'"]navbar\.html[\'"][\s\S]*?</script>)'
        if re.search(navbar_script_pattern, content):
            # Update the navbar loading script to initialize mobile nav
            updated_script = '''<script>
  document.addEventListener('DOMContentLoaded', () => {
    fetch('navbar.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
        // Initialize mobile navigation after navbar is loaded
        if (typeof initMobileNav === 'function') {
          initMobileNav();
        }
      })
      .catch(err => console.error("Navbar failed to load:", err));
  });
</script>
<script src="mobile-nav.js"></script>'''
            
            content = re.sub(navbar_script_pattern, updated_script, content)
        else:
            # If no navbar script found, add mobile-nav.js before closing body tag
            content = re.sub(r'</body>', '<script src="mobile-nav.js"></script>\n</body>', content)
        
        # 3. Update footer to use responsive styling
        footer_p_pattern = r'(<footer>[\s\S]*?<p[^>]*>)'
        if re.search(footer_p_pattern, content):
            content = re.sub(
                r'(<footer>[\s\S]*?)<p([^>]*)>',
                r'\1<p style="color: #ffffff; font-size: clamp(0.9rem, 2.5vw, 1.1rem); line-height: 1.8; font-family: \'Poppins\', sans-serif;">',
                content
            )
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated {file_path.name}")
            return True
        else:
            print(f"- No changes needed for {file_path.name}")
            return False
            
    except Exception as e:
        print(f"✗ Error updating {file_path.name}: {e}")
        return False

def main():
    """Main function to update all HTML files"""
    current_dir = Path('.')
    html_files = list(current_dir.glob('*.html'))
    
    if not html_files:
        print("No HTML files found in current directory")
        return
    
    print(f"Found {len(html_files)} HTML files")
    print("Updating files for mobile navigation support...\n")
    
    updated_count = 0
    for html_file in html_files:
        if update_html_file(html_file):
            updated_count += 1
    
    print(f"\n🎉 Successfully updated {updated_count} files!")
    print("All your HTML files now have mobile navigation support!")

if __name__ == "__main__":
    main()