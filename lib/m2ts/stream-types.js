/**
 * mux.js
 *
 * Copyright (c) Brightcove
 * Licensed Apache-2.0 https://github.com/videojs/mux.js/blob/master/LICENSE
 */
'use strict';

module.exports = {
  H264_STREAM_TYPE: 0x1B,
  ADTS_STREAM_TYPE: 0x0F,
  // https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/HLS_Sample_Encryption/TransportStreamSignaling/TransportStreamSignaling.html
  ENCRYPTED_H264_STREAM_TYPE: 0xDB,
  ENCRYPTED_ADTS_STREAM_TYPE: 0xCF,
  METADATA_STREAM_TYPE: 0x15
};
