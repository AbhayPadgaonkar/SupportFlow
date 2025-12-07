import random

with open("prepared/lm_corpus.txt", "r", encoding="utf-8") as f:
    lines = [ln.strip() for ln in f if ln.strip()]

random.shuffle(lines)

split = int(0.95 * len(lines))
train_lines = lines[:split]
val_lines = lines[split:]

with open("prepared/lm_train.txt", "w", encoding="utf-8") as f:
    for ln in train_lines:
        f.write(ln + "\n")

with open("prepared/lm_val.txt", "w", encoding="utf-8") as f:
    for ln in val_lines:
        f.write(ln + "\n")

print("Train lines:", len(train_lines))
print("Val lines:", len(val_lines))
