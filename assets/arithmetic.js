/*
	Arithmetic Coder
*/

var probTable = []
var encodedSeq = ""
var decodedSeq = ""
var lowerLimit = 0
var upperLimit = 255
var bitMask = 0x00FF
var pX = 0.7				// As suggested by mannual
var underFlow = false
var underFlowBits = ""


function initGlobals () {
	probTable = []
	encodedSeq = ""
	decodedSeq = ""
	lowerLimit = 0
	upperLimit = 255
	bitMask = 0x00FF
	underFlow = false
	underFlowBits = ""
}
function encode (seq) {
	//getProbTable (seq)
	var seqLen = seq.length
	var element = 0
	var pX
	var tag
	var i = 0

	// Loop through sequence taking each symbol
	// and generate the tag
	pX = 0.7				// As suggested by mannual
	while (i < seqLen) {
		element = seq [i]
		// Calculate the new range
		if (element == '0') 
			upperLimit = lowerLimit + (upperLimit - lowerLimit) * pX
		else
			lowerLimit = lowerLimit + (upperLimit - lowerLimit) * pX
		console.log ("lower: " + lowerLimit)
		console.log ("upper: " + upperLimit)
		// Removed bits
		testMsb (lowerLimit, upperLimit);
		++i;
	}

	/*
	tag = (lowerLimit + upperLimit) / 2
	console.log ("Getting remaing bits of tag...")
	while (tag > 0) {
		var msb = getMsb (tag)
		console.log ("Tag: " + tag)
		encodedSeq += msb.toString ()
		tag = tag << 1 & bitMask
	}
	*/
}
function toNum (str) {
	var n = 0
	for (var i = 0; i < 8; ++i) {
		if (str [i] == '1') {
			n += Math.pow (2, 7 - i)
		}
	}
	return n
}
function decode (n, seq) {
	lowerLimit = 0
	upperLimit = 255
	var x = toNum (seq)
	console.log ("X num: " + x)
	for (var i = 0; i < n; ++i) {
		if (x >= lowerLimit + (upperLimit - lowerLimit) * pX) {
			decodedSeq += "1"
			lowerLimit = lowerLimit + (upperLimit - lowerLimit) * pX
		} else {
			decodedSeq += "0"
			upperLimit = lowerLimit + (upperLimit - lowerLimit) * pX
		}
		console.log ("lower: " + lowerLimit)
		console.log ("upper: " + upperLimit)
	}
}

function getProbTable (seq) {
	/* Populate the probs array with probabilties using seq as the list */
	console.log ("Getting prob table for seq: " + seq)
	for (i = 0; i < seq.length; ++i) {
		probTable [seq [i]] = 0;
	}
	for (i = 0; i < seq.length; ++i) {
		probTable [seq [i]] += 1
			}
	for (i = 0; i < probTable.length; ++i) {
		probTable [seq [i]] /= seq.length
		console.log ("    Prob of " + seq [i] + " = " + probTable [seq [i]])
	}
}
/*
function getProb (sym) {
	if (!(probTable === undefined) && probTable [sym] != 0)
		return probTable [sym];
	return -1;
}
*/
function getMsb (bits) {
	return (bits & bitMask) >> 7
}

/*
	removes bits that already have been calculated so pression can be saved
	return - the number of bits removed
*/
function testMsb () {
	testUnderflow ();
	if (underFlow) {
		console.log ("		Underflow detected")
		getUnderflowBits ()
	} else {
		getReadyBits ()
	}

}
function testUnderflow (msbLower, msbUpper) {
	var msbLower = getMsb(lowerLimit)
	var msbUpper = getMsb(upperLimit)
	underFlow = msbLower == 0 && msbUpper == 1
	console.log ("msbLower, msbUpper, Underflow flag: " + 
			msbLower + ", " + msbUpper + ", " + underFlow)
}
function getReadyBits () {
	// Test MSB of lowerLimit and upperLimit
	var msbLower = getMsb(lowerLimit)
	var msbUpper = getMsb(upperLimit)
	var msb = msbLower
	console.log ("msb: " + msb)
	if (msbLower == msbUpper && underFlowBits.length > 0) {
		console.log ("Outputting msb and underflow bits")
		encodedSeq += msb.toString + underFlowBits
		lowerLimit = bitMask & (lowerLimit << 1)
		upperLimit = bitMask & (upperLimit << 1)
		// Reset underflow
		underFlow = false
		underFlowBits = ""
		msbLower = getMsb(lowerLimit)
		msbUpper = getMsb (upperLimit)
	}

	while (msbLower == msbUpper) {
		console.log ("Outputting only ready bits")
		console.log ("msb: " + msb);
		lowerLimit = bitMask & (lowerLimit << 1)
		upperLimit = bitMask & (upperLimit << 1)
		console.log ("After shift ...")
		console.log ("lower: " + lowerLimit)
		console.log ("upper: " + upperLimit)
		msbLower = getMsb (lowerLimit)
		msbUpper = getMsb (upperLimit)
		encodedSeq += msb.toString ()
		console.log ("Encoded: " + encodedSeq)
		console.log('')
	}
}

function getUnderflowBits () {
	// Shifting and saving the bits of lower and upper limit
	// so that the bits folloiwng them can be worked with sensibly
	var savedMsbLower = getMsb (lowerLimit)
	var savedMsbUpper = getMsb (upperLimit)
	var msbLower = getMsb(lowerLimit)
	var msbUpper = getMsb(upperLimit)
	while (msbLower == msbUpper) {
		var msb = msbLower
		console.log ("msb: " + msb)
		lowerLimit = bitMask & (lowerLimit << 1)
		upperLimit = bitMask & (upperLimit << 1)
		console.log ("After shift ...")
		console.log ("lower: " + lowerLimit)
		console.log ("upper: " + upperLimit)
		msbLower = getMsb (lowerLimit)
		msbUpper = getMsb (upperLimit)
		underFlowBits += msb.toString ()
		console.log ("Underflow bits: " + underFlowBits)
	}
	// Restore original bits
	console.log ("Saved msbLower: " + savedMsbLower)
	console.log ("Saved msbUpper: " + savedMsbUpper)
	console.log ("Old lowerLimit: " + lowerLimit)
	console.log ("Old upperLimit: " + upperLimit)
	lowerLimit = ((lowerLimit & bitMask) >> 1) | (savedMsbLower << 7 | 0x7F)
	upperLimit = ((upperLimit & bitMask) >> 1) | (savedMsbUpper << 7 | 0x7F)
	console.log ("New lower: " + lowerLimit)
	console.log ("New upper " + upperLimit)
	//return fjdsafj
}



///////////////////////////////////////////////////////////////////////
// Test code
// var seqList = ["10101010", "10101", "10001101", "abbababb", "1000001001", "1000001", "100001001"]
var seqList = ["101"]
function testEncode () {
	for (var i = 0; i < seqList.length; ++i) {
		initGlobals ()
		encode (seqList [i])
	}
}

function testDecode () {
	for (var i = 0; i < seqList.length; ++i, initGlobals ()) {
		encode (seqList [i])
		console.log ("Final Encodded Seq: " + encodedSeq)

		console.log(seqList [i].length)
		decode (seqList [i].length, encodedSeq)
		console.log ("Original seq: " + seqList [i])
		console.log ("Final decoded seq: " + decodedSeq)
	}
}
///////////////////////////////////////////////////////////////////////

// function main () {
// 	console.log ("Running tests ...")
// 	testEncode ()
// 	console.log ("Testing decode ...")
// 	testDecode ()
// 	console.log ("Completing tests ...")
// }

module.exports = {
	main: function() {
		console.log ("Running tests ...")
		// testEncode ()
		// console.log ("Testing decode ...")
		testDecode ()
		// console.log ("Completing tests ...")
	},
	encode: function(rleContent) {
		var encodedArray = []
		initGlobals()
		for (var i = 0; i < rleContent.length; ++i) {
			encode (rleContent[i])
			encodedArray.push(encodedSeq)
		}
		return encodedArray
	},
	decode: function (contentLength, content) {
		for (var i = 0; i < content.length; ++i, initGlobals ()) {
			console.log ("Final Encodded Seq: " + content)

			decode (contentLength, content[i])
			console.log ("Original seq: " + content [i])
			console.log ("Final decoded seq: " + decodedSeq)
		}
	}
}