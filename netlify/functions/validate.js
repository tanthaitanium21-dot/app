// นี่คือไฟล์ Serverless Function ของคุณ
// มันจะถูกรันโดยอัตโนมัติเมื่อมีการเรียก /api/validate

// (สำคัญมาก) นี่คือรหัสผ่านที่คุณต้องไปตั้งค่าใน Netlify Environment Variables
// ชื่อ Key: ACCESS_CODE
const ACCESS_CODE = process.env.ACCESS_CODE;

// =======================================================
// นี่คือ "แอปทดสอบ" ที่ผมใส่ไว้ให้
// ถ้า Deploy ผ่าน คุณจะเห็นหน้าเว็บนี้หลังจากล็อกอิน
// =======================================================
const appHTML = `
<div class="p-8 bg-white shadow-lg rounded-lg max-w-2xl mx-auto mt-10">
    <h1 class="text-3xl font-bold text-green-600 mb-4">สำเร็จ! (Test App)</h1>
    <p class="text-slate-800 text-lg">
        การ Deploy ผ่าน GitHub และระบบ Login ทำงานถูกต้อง 100% ครับ!
    </p>
    <p class="text-slate-600 mt-4">
        นี่คือหน้าเว็บทดสอบที่อยู่ในไฟล์ <code>netlify/functions/validate.js</code>
    </p>
    <p class="text-slate-600 mt-2">
        <b>ขั้นตอนต่อไป:</b> ให้คุณเปิดไฟล์นี้ (ใน GitHub หรือในคอมของคุณ) 
        แล้วลบโค้ด HTML ส่วนนี้ทิ้ง (ตั้งแต่ <code>&lt;div class="p-8...</code>) 
        แล้วนำโค้ดแอปเครื่องคิดเลขไฟฟ้า (HTML+JS+CSS) ของคุณมาวางแทนที่ได้เลย
    </p>
    
    <!-- สคริปต์ของแอปต้องมี id นี้ -->
    <script id="main-calculator-script">
        // นี่คือสคริปต์ของแอปทดสอบ
        console.log('Test App Script Loaded Successfully!');
        
        // ตัวแปร appData ถูกส่งมาจากไฟล์ validate.js
        // คุณสามารถใช้ appData.message ในโค้ดของคุณได้
        console.log('Data received:', appData.message);
    </script>
</div>
`;

// =======================================================
// นี่คือ "ข้อมูลทดสอบ"
// =======================================================
const appData = {
    message: "Data loaded from validate.js successfully",
    testMode: true
};


// --- นี่คือโค้ดของ Server Function (ไม่ต้องแก้ไข) ---

exports.handler = async (event, context) => {
    // อนุญาตให้ทุกคนเรียกใช้ได้ (CORS)
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // ตอบกลับ pre-flight request (สำหรับ CORS)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers
        };
    }

    let body;
    try {
        body = JSON.parse(event.body || '{}');
    } catch (e) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Invalid JSON body' }) };
    }

    const { action, code } = body;

    // --- ส่วนที่ 1: ตรวจสอบรหัสผ่าน ---
    if (action === 'validateCode') {
        if (!code) {
            return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'กรุณาระบุรหัส' }) };
        }
        if (!ACCESS_CODE) {
             return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'เซิร์ฟเวอร์ตั้งค่าไม่ถูกต้อง (ลืม ACCESS_CODE)' }) };
        }

        if (code === ACCESS_CODE) {
            // สร้าง Token ง่ายๆ (แค่ข้อความว่า 'authenticated' ก็พอ)
            const token = 'authenticated-user-token'; 
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, token: token })
            };
        } else {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ success: false, message: 'รหัสไม่ถูกต้อง' })
            };
        }
    }

    // --- ส่วนที่ 2: ส่งข้อมูลแอป (ต้องยืนยันตัวตนก่อน) ---
    if (action === 'getAppData') {
        // ตรวจสอบ Token ที่ส่งมาใน Header
        const token = event.headers.authorization ? event.headers.authorization.split(' ')[1] : null;

        // ตรวจสอบ Token (แบบง่ายๆ)
        if (token === 'authenticated-user-token') {
             return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    appHTML: appHTML,
                    appData: appData
                })
            };
        } else {
             return {
                statusCode: 401, // ไม่ได้รับอนุญาต
                headers,
                body: JSON.stringify({ success: false, message: 'ไม่ได้รับอนุญาตหรือ Token หมดอายุ' })
            };
        }
    }

    // ถ้า action ไม่ตรง
    return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Action ไม่ถูกต้อง' })
    };
};

