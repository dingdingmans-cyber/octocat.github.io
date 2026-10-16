"""生成剧情相关图片资源"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent / "assets"


def font(size=16):
    for name in ("msyh.ttc", "simhei.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            pass
    return ImageFont.load_default()


def save(img, rel):
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, optimize=True)
    print("wrote", path)


def vignette(img, strength=0.55):
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for i in range(40):
        a = int(255 * strength * (i / 40) ** 2)
        draw.rectangle([0, i, w, i + 1], fill=(0, 0, 0, a))
        draw.rectangle([0, h - i - 1, w, h - i], fill=(0, 0, 0, a))
        draw.rectangle([i, 0, i + 1, h], fill=(0, 0, 0, a))
        draw.rectangle([w - i - 1, 0, w - i, h], fill=(0, 0, 0, a))
    return Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")


def noise(img, amount=18):
    import random
    px = img.load()
    w, h = img.size
    for _ in range(w * h // amount):
        x, y = random.randrange(w), random.randrange(h)
        n = random.randint(-30, 30)
        r, g, b = px[x, y]
        px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
    return img


def victim_portrait(name, color, rel):
    w, h = 220, 280
    img = Image.new("RGB", (w, h), (28, 28, 34))
    draw = ImageDraw.Draw(img)
    draw.rectangle([12, 12, w - 12, h - 12], outline=(90, 90, 100), width=2)
    draw.ellipse([70, 40, 150, 120], fill=(45, 45, 55))
    draw.rectangle([55, 125, 165, 230], fill=(38, 38, 48))
    draw.text((18, h - 42), name, fill=(200, 200, 210), font=font(18))
    draw.text((18, h - 22), "失联", fill=color, font=font(14))
    img = noise(img, 22)
    save(img, rel)


def cctv_frame(rel, label, second_face=False):
    w, h = 720, 405
    base = Image.new("RGB", (w, h), (12, 22, 12))
    draw = ImageDraw.Draw(base)
    for y in range(0, h, 4):
        draw.line([(0, y), (w, y)], fill=(14, 26, 14), width=1)
    draw.rectangle([0, h - 80, w, h], fill=(8, 14, 8))
    draw.rectangle([40, 120, 280, 320], outline=(40, 70, 40), width=2)
    draw.rectangle([420, 100, 680, 330], outline=(40, 70, 40), width=2)
    draw.ellipse([520, 150, 590, 220], fill=(25, 35, 25))
    draw.rectangle([500, 220, 610, 310], fill=(20, 30, 20))
    if second_face:
        draw.ellipse([600, 165, 655, 220], fill=(35, 20, 20))
        draw.text((610, 200), "?", fill=(180, 40, 40), font=font(20))
    draw.text((20, 20), "CAM-B2-WEST", fill=(80, 200, 80), font=font(16))
    draw.text((20, h - 58), label, fill=(120, 220, 120), font=font(20))
    draw.text((w - 210, h - 58), "REC ●", fill=(200, 60, 60), font=font(18))
    img = noise(base, 12)
    img = vignette(img, 0.35)
    save(img, rel)


def parking_map(rel):
    w, h = 800, 520
    img = Image.new("RGB", (w, h), (36, 40, 48))
    draw = ImageDraw.Draw(img)
    draw.rectangle([30, 30, w - 30, h - 30], fill=(48, 52, 60), outline=(90, 95, 105))
    draw.text((40, 40), "翡翠湾 B2 停车场", fill=(220, 220, 230), font=font(22))
    spots = [(120, 180), (280, 180), (440, 180), (600, 180)]
    labels = ["方晓 2/22", "赵婷 3/1", "周岚 3/8", "林雨 3/15"]
    colors = [(200, 80, 80), (200, 100, 80), (200, 120, 80), (220, 50, 50)]
    for (x, y), lab, col in zip(spots, labels, colors):
        draw.rectangle([x, y, x + 90, y + 160], outline=(100, 105, 115), width=2)
        draw.ellipse([x + 30, y + 50, x + 60, y + 80], fill=col)
        draw.text((x - 5, y + 170), lab, fill=col, font=font(14))
    draw.rectangle([350, 320, 450, 380], outline=(120, 180, 255), width=2)
    draw.text((360, 335), "748", fill=(120, 180, 255), font=font(20))
    draw.text((330, 390), "储物柜", fill=(150, 170, 190), font=font(14))
    draw.line([(165, 260), (325, 260), (485, 260), (645, 260)], fill=(180, 60, 60), width=2)
    save(img, rel)


def mirror_selfie(rel):
    w, h = 480, 640
    img = Image.new("RGB", (w, h), (18, 18, 22))
    draw = ImageDraw.Draw(img)
    draw.rectangle([60, 40, 420, 560], fill=(30, 30, 38), outline=(70, 70, 80), width=3)
    draw.ellipse([170, 120, 310, 260], fill=(55, 50, 58))
    draw.rectangle([150, 260, 330, 500], fill=(48, 45, 52))
    draw.ellipse([300, 140, 380, 220], fill=(40, 35, 42))
    draw.text((70, 580), "IMG_elevator.jpg", fill=(140, 140, 150), font=font(14))
    draw.text((70, 20), "3月14日 23:51", fill=(120, 120, 130), font=font(14))
    img = noise(img, 20)
    img = vignette(img, 0.5)
    save(img, rel)


def parking_sign(rel):
    w, h = 640, 400
    img = Image.new("RGB", (w, h), (25, 28, 32))
    draw = ImageDraw.Draw(img)
    draw.rectangle([180, 60, 460, 300], fill=(200, 40, 40))
    draw.text((220, 130), "B2", fill=(255, 255, 255), font=font(72))
    draw.text((210, 220), "停车场", fill=(255, 240, 240), font=font(28))
    draw.text((80, 330), "翡翠湾 · 西侧入口", fill=(180, 180, 190), font=font(18))
    img = noise(img, 25)
    save(img, rel)


def main():
    victim_portrait("方晓", (220, 120, 120), "caseboard/victim-fangxiao.png")
    victim_portrait("赵婷", (220, 140, 100), "caseboard/victim-zhaoting.png")
    victim_portrait("周岚", (220, 160, 100), "caseboard/victim-zhoulan.png")
    victim_portrait("林雨", (240, 80, 80), "caseboard/victim-linyu.png")
    cctv_frame("cctv/cctv-b2-normal.jpg", "2024-03-14  02:58:11", False)
    cctv_frame("cctv/cctv-b2-glitch.jpg", "2024-03-15  03:17:44", True)
    parking_map("maps/b2-parking-map.png")
    mirror_selfie("photos/photo-4-mirror.jpg")
    parking_sign("photos/photo-5-b2-sign.jpg")


if __name__ == "__main__":
    main()
