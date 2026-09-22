import os, subprocess, sys, datetime

sys.stdout.reconfigure(encoding='utf-8')

repo_dir = os.path.dirname(os.path.abspath(__file__))
remote_url = "https://github.com/maxecoenergytech/nohadaya.git"

print("=" * 60)
print("  🚀 NOHADAYA STUDIO — AUTO GITHUB PUSH & DEPLOY")
print("=" * 60)
print(f"📁 Repository Directory: {repo_dir}")
print(f"🔗 Target GitHub Remote: {remote_url}\n")

def run_cmd(cmd, cwd=repo_dir, check=True):
    print(f"👉 Running: {cmd}")
    res = subprocess.run(cmd, shell=True, cwd=cwd, text=True, capture_output=True)
    if res.stdout.strip():
        print(res.stdout.strip())
    if res.returncode != 0 and check:
        print(f"⚠️ Error ({res.returncode}): {res.stderr.strip()}")
    return res

# 1. Check if git initialized
if not os.path.exists(os.path.join(repo_dir, ".git")):
    print("📦 Initializing local Git repository...")
    run_cmd("git init")
    run_cmd("git branch -M main")

# 2. Check / set remote
res_remote = run_cmd("git remote -v", check=False)
if "origin" not in res_remote.stdout:
    print(f"🔗 Adding remote origin: {remote_url}")
    run_cmd(f"git remote add origin {remote_url}")
else:
    print("🔗 Remote origin already configured.")

# 3. Add all files
print("\n📝 Staging updated files...")
run_cmd("git add -A")

# 4. Check status
res_status = run_cmd("git status --porcelain", check=False)
if not res_status.stdout.strip():
    print("✨ Working tree clean — no new changes to commit.")
else:
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_msg = f"Update: {timestamp} (Auto-sync website, ERP & gallery assets)"
    print(f"\n💾 Committing changes: '{commit_msg}'...")
    run_cmd(f'git commit -m "{commit_msg}"')

# 5. Push to GitHub
print("\n🚀 Pushing to GitHub (main branch)...")
push_res = run_cmd("git push -u origin main", check=False)

if push_res.returncode == 0:
    print("\n" + "=" * 60)
    print("  ✅ SUCCESS! PUSH COMPLETED SUCCESSFULLY")
    print("=" * 60)
    print("🌐 GitHub Repo : https://github.com/maxecoenergytech/nohadaya")
    print("☁️ Cloudflare   : Auto-deploying in ~10 seconds...")
    print("🔗 Live Website : https://www.nohadaya.com")
    print("🔒 Live ERP     : https://www.nohadaya.com/erp")
    print("=" * 60)
else:
    # If rejected due to remote branch history, merge safely to preserve all historical commits
    if "fetch first" in push_res.stderr or "non-fast-forward" in push_res.stderr or "rejected" in push_res.stderr:
        print("\n🔄 Remote repository has existing history. Merging safely to preserve all records...")
        run_cmd("git pull --no-rebase origin main --allow-unrelated-histories -X ours", check=False)
        print("🚀 Retrying push...")
        retry_res = run_cmd("git push -u origin main", check=False)
        if retry_res.returncode == 0:
            print("\n" + "=" * 60)
            print("  ✅ SUCCESS! SYNCED & PUSHED TO GITHUB (ALL HISTORICAL RECORDS PRESERVED)")
            print("=" * 60)
            print("🌐 GitHub Repo : https://github.com/maxecoenergytech/nohadaya")
            print("☁️ Cloudflare   : Auto-deploying in ~10 seconds...")
            print("🔗 Live Website : https://www.nohadaya.com")
            print("🔒 Live ERP     : https://www.nohadaya.com/erp")
            print("=" * 60)
        else:
            print(f"\n⚠️ Push notice: {retry_res.stderr.strip()}")
    else:
        print(f"\n⚠️ Push output: {push_res.stderr.strip()}")
