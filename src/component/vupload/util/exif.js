/*
eslint-disable
*/
(function () {
    var root = this
  
    var EXIF = function (obj) {
      if (obj instanceof EXIF) return obj
      if (!(this instanceof EXIF)) return new EXIF(obj)
      this.EXIFwrapped = obj
    }
  
    if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = EXIF
      }
      exports.EXIF = EXIF
    } else {
      root.EXIF = EXIF
    }
  
    var TiffTags = EXIF.TiffTags = {
      0x0100: 'ImageWidth',
      0x0101: 'ImageHeight',
      0x8769: 'ExifIFDPointer',
      0x8825: 'GPSInfoIFDPointer',
      0xA005: 'InteroperabilityIFDPointer',
      0x0102: 'BitsPerSample',
      0x0103: 'Compression',
      0x0106: 'PhotometricInterpretation',
      0x0112: 'Orientation',
      0x0115: 'SamplesPerPixel',
      0x011C: 'PlanarConfiguration',
      0x0212: 'YCbCrSubSampling',
      0x0213: 'YCbCrPositioning',
      0x011A: 'XResolution',
      0x011B: 'YResolution',
      0x0128: 'ResolutionUnit',
      0x0111: 'StripOffsets',
      0x0116: 'RowsPerStrip',
      0x0117: 'StripByteCounts',
      0x0201: 'JPEGInterchangeFormat',
      0x0202: 'JPEGInterchangeFormatLength',
      0x012D: 'TransferFunction',
      0x013E: 'WhitePoint',
      0x013F: 'PrimaryChromaticities',
      0x0211: 'YCbCrCoefficients',
      0x0214: 'ReferenceBlackWhite',
      0x0132: 'DateTime',
      0x010E: 'ImageDescription',
      0x010F: 'Make',
      0x0110: 'Model',
      0x0131: 'Software',
      0x013B: 'Artist',
      0x8298: 'Copyright'
    }
  
    function base64ToArrayBuffer (base64, contentType) {
      contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || '' // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
      base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '')
      var binary = atob(base64)
      var len = binary.length
      var buffer = new ArrayBuffer(len)
      var view = new Uint8Array(buffer)
      for (var i = 0; i < len; i++) {
        view[i] = binary.charCodeAt(i)
      }
      return buffer
    }
  
    function objectURLToBlob (url, callback) {
      var http = new XMLHttpRequest()
      http.open('GET', url, true)
      http.responseType = 'blob'
      http.onload = function (e) {
        if (this.status == 200 || this.status === 0) {
          callback(this.response)
        }
      }
      http.send()
    }
  
    function getImageData (img, callback) {
      function handleBinaryFile (binFile) {
        var data = findEXIFinJPEG(binFile)
        img.exifdata = data || {}
        if (callback) {
          callback.call(img)
        }
      }
  
      if (/^data\:/i.test(img.src)) { // Data URI
        var arrayBuffer = base64ToArrayBuffer(img.src)
        handleBinaryFile(arrayBuffer)
      } else if (/^blob\:/i.test(img.src)) { // Object URL
        var fileReader = new FileReader()
        fileReader.onload = function (e) {
          handleBinaryFile(e.target.result)
        }
        objectURLToBlob(img.src, function (blob) {
          fileReader.readAsArrayBuffer(blob)
        })
      } else {
        var http = new XMLHttpRequest()
        http.onload = function () {
          if (this.status == 200 || this.status === 0) {
            handleBinaryFile(http.response)
          } else {
            throw 'Could not load image'
          }
          http = null
        }
        http.open('GET', img.src, true)
        http.responseType = 'arraybuffer'
        http.send(null)
      }
    }
  
    function findEXIFinJPEG (file) {
      var dataView = new DataView(file)
  
      if ((dataView.getUint8(0) != 0xFF) || (dataView.getUint8(1) != 0xD8)) {
        if (location.search.search('kwt_debug=on') > -1 || document.cookie.search('kwt_debug=on') > -1) {
          console.log('Not a valid JPEG')
        }
        return false // not a valid jpeg
      }
  
      var offset = 2,
        length = file.byteLength,
        marker
  
      while (offset < length) {
        if (dataView.getUint8(offset) != 0xFF) {
          if (location.search.search('kwt_debug=on') > -1 || document.cookie.search('kwt_debug=on') > -1) {
            console.log('Not a valid marker at offset ' + offset + ', found: ' + dataView.getUint8(offset))
          }
          return false // not a valid marker, something is wrong
        }
  
        marker = dataView.getUint8(offset + 1)
  
              // we could implement handling for other markers here,
              // but we're only looking for 0xFFE1 for EXIF data
  
        if (marker == 225) {
          return readEXIFData(dataView, offset + 4, dataView.getUint16(offset + 2) - 2)
  
                  // offset += 2 + file.getShortAt(offset+2, true);
        } else {
          offset += 2 + dataView.getUint16(offset + 2)
        }
      }
    }
  
    function readTags (file, tiffStart, dirStart, strings, bigEnd) {
      var entries = file.getUint16(dirStart, !bigEnd),
        tags = {},
        entryOffset, tag,
        i
  
      for (i = 0; i < entries; i++) {
        entryOffset = dirStart + i * 12 + 2
        tag = strings[file.getUint16(entryOffset, !bigEnd)]
        if (!tag && (location.search.search('kwt_debug=on') > -1 || document.cookie.search('kwt_debug=on') > -1)) {
          console.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd))
        }
        tags[tag] = readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd)
      }
      return tags
    }
  
    function readTagValue (file, entryOffset, tiffStart, dirStart, bigEnd) {
      var type = file.getUint16(entryOffset + 2, !bigEnd),
        numValues = file.getUint32(entryOffset + 4, !bigEnd),
        valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart,
        offset,
        vals, val, n,
        numerator, denominator
  
      switch (type) {
        case 1: // byte, 8-bit unsigned int
        case 7: // undefined, 8-bit byte, value depending on field
          if (numValues == 1) {
            return file.getUint8(entryOffset + 8, !bigEnd)
          } else {
            offset = numValues > 4 ? valueOffset : (entryOffset + 8)
            vals = []
            for (n = 0; n < numValues; n++) {
              vals[n] = file.getUint8(offset + n)
            }
            return vals
          }
  
        case 2: // ascii, 8-bit byte
          offset = numValues > 4 ? valueOffset : (entryOffset + 8)
          return getStringFromDB(file, offset, numValues - 1)
  
        case 3: // short, 16 bit int
          if (numValues == 1) {
            return file.getUint16(entryOffset + 8, !bigEnd)
          } else {
            offset = numValues > 2 ? valueOffset : (entryOffset + 8)
            vals = []
            for (n = 0; n < numValues; n++) {
              vals[n] = file.getUint16(offset + 2 * n, !bigEnd)
            }
            return vals
          }
  
        case 4: // long, 32 bit int
          if (numValues == 1) {
            return file.getUint32(entryOffset + 8, !bigEnd)
          } else {
            vals = []
            for (n = 0; n < numValues; n++) {
              vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd)
            }
            return vals
          }
  
        case 5:    // rational = two long values, first is numerator, second is denominator
          if (numValues == 1) {
            numerator = file.getUint32(valueOffset, !bigEnd)
            denominator = file.getUint32(valueOffset + 4, !bigEnd)
            val = new Number(numerator / denominator)
            val.numerator = numerator
            val.denominator = denominator
            return val
          } else {
            vals = []
            for (n = 0; n < numValues; n++) {
              numerator = file.getUint32(valueOffset + 8 * n, !bigEnd)
              denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd)
              vals[n] = new Number(numerator / denominator)
              vals[n].numerator = numerator
              vals[n].denominator = denominator
            }
            return vals
          }
  
        case 9: // slong, 32 bit signed int
          if (numValues == 1) {
            return file.getInt32(entryOffset + 8, !bigEnd)
          } else {
            vals = []
            for (n = 0; n < numValues; n++) {
              vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd)
            }
            return vals
          }
  
        case 10: // signed rational, two slongs, first is numerator, second is denominator
          if (numValues == 1) {
            return file.getInt32(valueOffset, !bigEnd) / file.getInt32(valueOffset + 4, !bigEnd)
          } else {
            vals = []
            for (n = 0; n < numValues; n++) {
              vals[n] = file.getInt32(valueOffset + 8 * n, !bigEnd) / file.getInt32(valueOffset + 4 + 8 * n, !bigEnd)
            }
            return vals
          }
      }
    }
  
      /**
      * Given an IFD (Image File Directory) start offset
      * returns an offset to next IFD or 0 if it's the last IFD.
      */
  
    function getStringFromDB (buffer, start, length) {
      var outstr = '', n
      for (n = start; n < start + length; n++) {
        outstr += String.fromCharCode(buffer.getUint8(n))
      }
      return outstr
    }
  
    function readEXIFData (file, start) {
      if (getStringFromDB(file, start, 4) != 'Exif') {
        if (location.search.search('kwt_debug=on') > -1 || document.cookie.search('kwt_debug=on') > -1) {
          console.log('Not valid EXIF data! ' + getStringFromDB(file, start, 4))
        }
        return false
      }
  
      var bigEnd,
        tags, tag,
        exifData, gpsData,
        tiffOffset = start + 6
  
          // test for TIFF validity and endianness
      if (file.getUint16(tiffOffset) == 0x4949) {
        bigEnd = false
      } else if (file.getUint16(tiffOffset) == 0x4D4D) {
        bigEnd = true
      } else {
        if (location.search.search('kwt_debug=on') > -1 || document.cookie.search('kwt_debug=on') > -1) {
          console.log('Not valid TIFF data! (no 0x4949 or 0x4D4D)')
        }
        return false
      }
  
      if (file.getUint16(tiffOffset + 2, !bigEnd) != 0x002A) {
        if (location.search.search('kwt_debug=on') > -1 || document.cookie.search('kwt_debug=on') > -1) {
          console.log('Not valid TIFF data! (no 0x002A)')
        }
        return false
      }
  
      var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd)
  
      if (firstIFDOffset < 0x00000008) {
        if (location.search.search('kwt_debug=on') > -1 || document.cookie.search('kwt_debug=on') > -1) {
          console.log('Not valid TIFF data! (First offset less than 8)', file.getUint32(tiffOffset + 4, !bigEnd))
        }
        return false
      }
  
      tags = readTags(file, tiffOffset, tiffOffset + firstIFDOffset, TiffTags, bigEnd)
  
      return tags
    }
  
    EXIF.getData = function (img, callback) {
      if (img.src && !img.exifdata) {
        getImageData(img, callback)
      } else {
        if (callback) {
          callback.call(img)
        }
      }
      return true
    }
  
    if (typeof define === 'function' && define.amd) {
      define('exif-js', [], function () {
        return EXIF
      })
    }
  }.call(this))