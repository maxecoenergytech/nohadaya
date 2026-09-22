import os, time, subprocess, sys

sys.stdout.reconfigure(encoding='utf-8')
repo_dir = os.path.dirname(os.path.abspath(__file__))

print("=" * 60)
print("  👀 NOHADAYA STUDIO — REAL-TIME FILE WATCHER & AUTO PUSHER")
print("=" * 60)
print(f"📁 Watching Directory: {repo_dir}")
print("🔄 Checking for file changes every 15 seconds...")
print("💡 Any file you edit/save will automatically push to GitHub.")
print("🛑 Press Ctrl+C in this window anytime to stop watching.\n")

def check_for_changes():
    res = subprocess.run("git status --porcelain", shell=True, cwd=repo_dir, capture_output=True, text=True)
    return bool(res.stdout.strip())

try:
    while True:
        if check_for_changes():
            print(f"\n⚡ [{time.strftime('%H:%M:%S')}] Detected local modifications! Starting auto push...")
            subprocess.run([sys.executable, "auto_push.py"], cwd=repo_dir)
            print(f"\n⏳ [{time.strftime('%H:%M:%S')}] Auto push finished. Resuming file watch...\n")
        time.sleep(15)
except KeyboardInterrupt:
    print("\n🛑 Auto watcher stopped by user.")
