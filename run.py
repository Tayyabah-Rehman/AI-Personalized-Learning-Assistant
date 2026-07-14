import os
import subprocess
import sys

# Change to project directory
os.chdir(r"C:\Users\Sunny\PycharmProjects\AI-Learning-Assistant")

print("Starting AI Learning Assistant...")
print("Press Ctrl+C to stop the server.\n")

try:
    # Run npm dev - this will stop when Ctrl+C is pressed
    subprocess.run("npm run dev", shell=True)
except KeyboardInterrupt:
    print("\n\n✅ Server stopped.")
    sys.exit(0)