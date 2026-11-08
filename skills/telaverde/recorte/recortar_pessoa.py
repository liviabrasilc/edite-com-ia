"""Tira o fundo do vídeo da pessoa e salva um .webm com transparência (VP9 com alfa).
Uso: python3 recortar_pessoa.py <video-original> <saida.webm> <modelo.tflite>
Precisa de: pip install mediapipe opencv-python numpy ; ffmpeg instalado.
Modelo (baixe uma vez): https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite
Nunca sobrescreva o vídeo original: a saída é sempre um arquivo novo."""
import sys, subprocess, numpy as np, cv2, mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions
src, out, modelo = sys.argv[1], sys.argv[2], sys.argv[3]
seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
    base_options=BaseOptions(model_asset_path=modelo), running_mode=vision.RunningMode.VIDEO, output_confidence_masks=True))
cap = cv2.VideoCapture(src); fps = cap.get(5); w = int(cap.get(3)); h = int(cap.get(4))
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', f'{w}x{h}', '-r', str(fps), '-i', '-',
                      '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', '-b:v', '6M', '-auto-alt-ref', '0', out], stdin=subprocess.PIPE)
i, prev = 0, None
while True:
    ok, fr = cap.read()
    if not ok: break
    rgb = cv2.cvtColor(fr, cv2.COLOR_BGR2RGB)
    r = seg.segment_for_video(mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb), int(i * 1000 / fps))
    m = cv2.GaussianBlur(1.0 - r.confidence_masks[0].numpy_view(), (5, 5), 0)  # canal 0 = fundo
    if prev is not None: m = 0.6 * m + 0.4 * prev  # suaviza tremidas entre quadros
    prev = m
    a = np.clip((m - 0.35) / 0.3, 0, 1)
    p.stdin.write(np.dstack([rgb, (a * 255).astype(np.uint8)]).tobytes()); i += 1
p.stdin.close(); p.wait(); print('quadros recortados:', i)
