exports.execFileReturnObjectFixture = {
  stdout: undefined,
  stderr: `ffmpeg version 4.4.1 Copyright (c) 2000-2021 the FFmpeg developers
  built with Apple clang version 13.0.0 (clang-1300.0.29.3)
  configuration: --prefix=/opt/homebrew/Cellar/ffmpeg/4.4.1_5 --enable-shared --enable-pthreads --enable-version3 --cc=clang --host-cflags= --host-ldflags= --enable-ffplay --enable-gnutls --enable-gpl --enable-libaom --enable-libbluray --enable-libdav1d --enable-libmp3lame --enable-libopus --enable-librav1e --enable-librist --enable-librubberband --enable-libsnappy --enable-libsrt --enable-libtesseract --enable-libtheora --enable-libvidstab --enable-libvmaf --enable-libvorbis --enable-libvpx --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxml2 --enable-libxvid --enable-lzma --enable-libfontconfig --enable-libfreetype --enable-frei0r --enable-libass --enable-libopencore-amrnb --enable-libopencore-amrwb --enable-libopenjpeg --enable-libspeex --enable-libsoxr --enable-libzmq --enable-libzimg --disable-libjack --disable-indev=jack --enable-avresample --enable-videotoolbox
  libavutil      56. 70.100 / 56. 70.100
  libavcodec     58.134.100 / 58.134.100
  libavformat    58. 76.100 / 58. 76.100
  libavdevice    58. 13.100 / 58. 13.100
  libavfilter     7.110.100 /  7.110.100
  libavresample   4.  0.  0 /  4.  0.  0
  libswscale      5.  9.100 /  5.  9.100
  libswresample   3.  9.100 /  3.  9.100
  libpostproc    55.  9.100 / 55.  9.100
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from '/Users/SteveJobs/test.mp4':
  Metadata:
    major_brand     : nvr1
    minor_version   : 65537
    compatible_brands: isommp42nvr1
    creation_time   : 2020-06-30T08:18:22.000000Z
    location        : +65.4752+027.9785/
    location-eng    : +65.4752+027.9785/
    com.android.version: 10
  Duration: 00:00:34.56, start: 0.000000, bitrate: 20455 kb/s
  Stream #0:0(eng): Video: h264 (High) (avc1 / 0x31637661), yuvj420p(pc, smpte170m), 1920x1080, 20003 kb/s, SAR 1:1 DAR 16:9, 29.49 fps, 29.50 tbr, 90k tbn, 180k tbc (default)
    Metadata:
      rotate          : 90
      creation_time   : 2020-06-30T08:18:22.000000Z
      handler_name    : VideoHandle
      vendor_id       : [0][0][0][0]
    Side data:
      displaymatrix: rotation of -90.00 degrees
  Stream #0:1(eng): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 286 kb/s (default)
    Metadata:
      creation_time   : 2020-06-30T08:18:22.000000Z
      handler_name    : SoundHandle
      vendor_id       : [0][0][0][0]
Stream mapping:
  Stream #0:0 -> #0:0 (h264 (native) -> mjpeg (native))
Press [q] to stop, [?] for help
Output #0, image2, to '/tmp/e48940c2-fbb1-4003-8e34-4ef4a1c7c7a2.jpg':
  Metadata:
    major_brand     : nvr1
    minor_version   : 65537
    compatible_brands: isommp42nvr1
    com.android.version: 10
    location        : +65.4752+027.9785/
    location-eng    : +65.4752+027.9785/
    encoder         : Lavf58.76.100
  Stream #0:0(eng): Video: mjpeg, yuvj420p(pc, smpte170m, progressive), 1080x1920 [SAR 1:1 DAR 9:16], q=2-31, 200 kb/s, 29.50 fps, 29.50 tbn (default)
    Metadata:
      encoder         : Lavc58.134.100 mjpeg
      creation_time   : 2020-06-30T08:18:22.000000Z
      handler_name    : VideoHandle
      vendor_id       : [0][0][0][0]
    Side data:
      cpb: bitrate max/min/avg: 0/0/200000 buffer size: 0 vbv_delay: N/A
      displaymatrix: rotation of -0.00 degrees
frame=    1 fps=0.0 q=6.5 size=N/A time=00:00:00.03 bitrate=N/A speed=0.192x
frame=    1 fps=0.0 q=6.5 Lsize=N/A time=00:00:00.03 bitrate=N/A speed=0.179x
video:83kB audio:0kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: unknown`,
}
