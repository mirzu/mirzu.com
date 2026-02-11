---
title: 'Reusable Development Environments on a VM Part 1: Setting Up the DNS to Work Properly on Mac OSX'
description: |
  A step-by-step guide to configuring a local DNS server on Mac OSX so that virtual machine development environments automatically resolve wildcard domains.
pubDate: 'August 29, 2012'
coverImage: '../../assets/blogimages/osx-dns.jpg'
coverImageCredit: 'Mike Minecki and chatGTP'
---

When running local development on a virtual machine, adding a new site means manually editing your /etc/hosts file every time — because Mac OSX doesn't support wildcard entries like `*.local`. This tutorial walks through setting up a BIND DNS server on your Mac to solve that problem, so that any new subdirectory you create on your VM automatically becomes a resolvable local domain. The guide covers editing named.conf, creating zone files, generating the required keys, starting the daemon, and verifying everything works with dig and ping. If you're tired of manually managing hosts entries for local development, [read the full article](https://www.fourkitchens.com/blog/article/reusable-development-enviroments-vm-part-1-setting-dns-work-properly-mac-osx/).
