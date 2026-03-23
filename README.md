# Homelab Infrastructure as Code

![CI/CD Status](https://github.com/rostbond/infrastructure-as-code/actions/workflows/deploy.yml/badge.svg)
![Ansible Lint](https://img.shields.io/badge/Ansible--Lint-passing-brightgreen?style=flat&logo=ansible)

![Ansible](https://img.shields.io/badge/Ansible-2.16%2B-red?style=for-the-badge&logo=ansible&logoColor=white)
![Podman](https://img.shields.io/badge/Podman-Rootless-892CA0?style=for-the-badge&logo=podman&logoColor=white)
![Proxmox](https://img.shields.io/badge/Proxmox-VE-E57020?style=for-the-badge&logo=proxmox&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-4fb325?style=for-the-badge)

This repository contains a production-ready Infrastructure-as-Code (IaC) solution to deploy and manage a containerized ecosystem. It automates the provisioning of a **Caddy** edge server with custom DNS modules and coordinates multiple application containers.

> [!NOTE]
> ## Why This Project Exists (The "Why")
> 
> ### 1. From Manual Toil to Infrastructure as Code
> After reinstalling Proxmox twice and manually configuring every container from scratch, I realized that "manual" is the enemy of stability and time consuming. This repetitive process sparked my transition to Automation.  
> 
> I first prototyped this automated approach on a remote cloud environment (check out my other repository: [rostbond/oracle-vps](https://github.com/rostbond/oracle-vps)) and, once the concept was proven, I successfully implemented it on my Home Lab server. Now, a full environment recovery takes minutes instead of hours.
> 
> ### 2. Career Evolution: QA to DevOps
> Currently, I work as a QA Engineer, but my professional goal is to transition into a DevOps role. 
> 
> This project serves as my "hands-on" laboratory for mastering the modern DevOps toolchain:
> - **Configuration Management**: Mastering Ansible roles, playbooks, and idempotency.
> - **Infrastructure Orchestration**: Automating Proxmox, LXC, and Podman lifecycles.
> - **Security & Networking**: Automating SSL (ACME/DNS-01) and reverse proxy configurations.
> - **Problem Solving**: Moving beyond "testing" the software to "building and sustaining" the platform it runs on.
 
## Skills & Tools Applied
This project represents a shift toward System-Native Infrastructure, prioritizing security, observability, and standard Linux process management.
 
### Containerization & Security (The Podman Stack)
* **Rootless Podman**: Implementing a daemonless container engine to run services without root privileges, significantly reducing the security attack surface.
* **Quadlets (systemd-native)**: Moving beyond `docker-compose` to leverage Quadlets. This ensures containers are managed as native systemd services, providing superior lifecycle management, auto-starts, and dependency handling.
* **User Namespaces**: Managing complex UID/GID mappings (`subuid`/`subgid`) to ensure secure persistent data volume mounts in a rootless environment.

### Infrastructure & Orchestration
* **Ansible**: Designing idempotent playbooks to automate the transition from raw Proxmox LXC/VMs to fully configured application nodes.
* **Proxmox VE**: Architecting the underlying virtualization layer for Home Lab consistency.
* **Infrastructure as Code (IaC)**: Eliminating manual "Snowflake Servers" by codifying every configuration detail.

### Networking & Edge Proxy
* **Custom Caddy Builds**: Automating the injection of `dns.providers.digitalocean` modules using `caddy add-package`.
* **Zero-Touch SSL**: Fully automated TLS via ACME DNS-01 challenges, enabling secure internal services without exposing ports 80/443.

### The QA-to-DevOps Edge
My background in **Quality Assurance** informs my infrastructure philosophy:
* **Idempotency as a Requirement**: Every playbook is tested to ensure that the "Current State" always matches the "Desired State" without side effects.
* **Validation Logic**: Using advanced Ansible `failed_when` and `changed_when` conditions to provide clear, actionable feedback during deployment.
* **Security-First Quality**: Viewing rootless execution not just as a feature, but as a non-functional requirement for a high-quality platform.

## Zero-Trust Networking with Tailscale
To eliminate the risks of the public internet, this infrastructure follows Zero-Trust principles using a private Mesh VPN (Tailnet).

## Project Structure
```text
.
├── group_vars/
│   └── all/              # Global and group-specific variables
│       ├── vars.yml      # Common settings
│       └── vault.yml     # Secrets 
│
├── roles/
│   ├── proxmox/          # System setup, LXC containers creation, etc.
│   ├── adguard/          # Network-wide ads & trackers blocking DNS server 
│   ├── bar-assistant/    # All-in-one solution for managing your home bar  
│   ├── caddy/            # Reverse proxy with automatic  automatic HTTPS 
│   ├── fresh-rss/        # Free, self-hostable feed aggregator  
│   ├── gitea/            # Self-hosted all-in-one software development service 
│   ├── homepage/         # Highly customizable homepage 
│   ├── immich/           # High performance photo/video management solution 
│   ├── paperless/        # Supercharged document management system
│   ├── plex/             # Media streaming service
│   ├── pocket-id/        # OIDC provider with passkeys authentication 
│   ├── prowlarr/         # Indexer manager/proxy
│   ├── radarr/           # Movie organizer/manager 
│   ├── sonarr/           # Tv shows organizer/manager 
│   └── speedtest/        # Performance monitoring of internet connection 
├── .ansible-lint         # Linter settings
├── ansible.cfg           # Ansible environment configuration
├── inventory.yml         # Hosts and their configuration
├── requirements.yml      # Collections need to be installed
├── site.yml              # Master playbook
└── TODO.md               # Things to do
```

## Prerequisites
> [!IMPORTANT]
> Note that the tailscale key is expired if it is older than 90 days
- Control node: Ansible 2.16+.
- The `debian-13-standard_13.1-2_amd64.tar.zst` template downloaded on the Proxmox.
- SSH key pair configured on the control node and authorized on the target hosts.
- A password file located at `~/.ansible_vault_password` to decrypt secrets during execution.

    ## vault.yml
    ```yaml
    vault_proxmox_api_user: ""
    vault_proxmox_api_password: ""
    vault_speedtest_key: ""
    vault_gitea_database_password: ""
    vault_gitea_lfs_jwt_secret: ""
    vault_gitea_internal_token: ""
    vault_gitea_jwt_secret: ""
    vault_adguard_user: ""
    vault_adguard_password: ""
    vault_caddy_digital_ocean_token: ""
    vault_tailscale_key: ""
    vault_bar_assistant_meili_key: ""
    vault_bar_assistant_pocket_id_client_id: ""
    vault_bar_assistant_pocket_id_client_secret: ""
    vault_fresh_rss_pocket_id_client_id: ""
    vault_fresh_rss_pocket_id_client_secret: ""
    vault_fresh_rss_pocket_id_crypto_key: ""
    vault_immich_db_user: ""
    vault_immich_db_password: ""
    vault_pocket_id_encryption_key: ""
    vault_homepage_speedtest_key: ""
    vault_homepage_unifi_user: ""
    vault_homepage_unifi_password: ""
    ```

## Usage
```shell
ansible-playbook site.yml                    # run all

ansible-playbook site.yml --tags caddy       # run playbook for the caddy setup

ansible-vault edit group_vars/all/vault.yml  # edit the vault
```

## Quick Start
1. **Clone**: `git clone https://github.com/rostbond/infrastructure-as-code.git && cd infrastructure-as-code`
2. **Configure**: Update `inventory.yml` with your Proxmox IP and node details.
3. **Requirements**: Execute `ansible-galaxy install -r requirements.yml`
4. **Vault**: Create your secret file: `echo "your_password" > ~/.ansible_vault_password`
5. **SSH**: Adjust `ssh_key` in the `group_vars/all/vars.yml` 
6. **Deploy**: `ansible-playbook site.yml`
