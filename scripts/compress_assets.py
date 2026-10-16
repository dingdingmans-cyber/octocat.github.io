"""压缩 assets 图片：缩放 + JPEG/PNG 优化"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "assets"

RULES = {
    "prologue": (960, 540, "jpeg", 82),
    "photos": (800, 600, "jpeg", 82),
    "web": (800, 450, "jpeg", 80),
    "cctv": (640, 360, "jpeg", 78),
    "scare": (480, 480, "png", 48),
    "caseboard": (220, 280, "png", 32),
    "maps": (800, 520, "png", 48),
}


def fit_size(im, max_w, max_h):
    w, h = im.size
    scale = min(max_w / w, max_h / h, 1.0)
    if scale >= 1.0:
        return im
    return im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)


def strip_alpha(im):
    if im.mode != "RGBA":
        return im.convert("RGB")
    bg = Image.new("RGB", im.size, (0, 0, 0))
    bg.paste(im, mask=im.split()[3])
    return bg


def compress_file(path: Path):
    folder = path.parent.name
    max_w, max_h, fmt, quality = RULES.get(folder, (1200, 1200, "png", 96))
    before = path.stat().st_size
    im = Image.open(path)
    im = fit_size(im, max_w, max_h)

    if fmt == "jpeg":
        out = path.with_suffix(".jpg")
        im = strip_alpha(im)
        im.save(out, "JPEG", quality=quality, optimize=True, progressive=True)
        if out != path and path.exists():
            path.unlink()
        return before, out.stat().st_size, out

    im = strip_alpha(im)
    if quality < 256:
        im = im.quantize(colors=quality)
    im.save(path, "PNG", optimize=True, compress_level=9)
    return before, path.stat().st_size, path


def main():
    total_before = total_after = 0
    print(f"{'file':<42} {'before':>8} {'after':>8} {'save':>7}")
    print("-" * 70)
    for path in sorted(ROOT.rglob("*.png")):
        before, after, out = compress_file(path)
        rel = out.relative_to(ROOT.parent)
        pct = (1 - after / before) * 100 if before else 0
        total_before += before
        total_after += after
        note = " (jpg)" if out.suffix == ".jpg" else ""
        print(f"{str(rel):<42} {before//1024:>6}KB {after//1024:>6}KB {pct:>5.0f}%{note}")
    print("-" * 70)
    if total_before:
        print(f"TOTAL {total_before//1024}KB -> {total_after//1024}KB ({(1-total_after/total_before)*100:.0f}% saved)")


if __name__ == "__main__":
    main()
