// นี่คือไฟล์ validate.js (ไฟล์ที่ 4) ฉบับ "บังคับ" ล็อกอิน

// Environment Variables ที่เราตั้งค่าไว้ใน "ตู้เซฟ" Netlify
const ACCESS_CODE = process.env.ACCESS_CODE;

exports.handler = async (event, context) => {
    // ตรวจสอบว่าเป็นการส่งแบบ POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Invalid JSON' }) };
    }

    const { action, code } = body;

    // === ส่วนที่ 1: ตรวจสอบรหัสผ่าน ===
    if (action === 'validateCode') {
        if (!code) {
            return { statusCode: 400, body: JSON.stringify({ success: false, message: 'กรุณากรอกรหัส' }) };
        }

        // --- นี่คือ "ยาแก้" (The Fix) ---
        // เรา "บังคับ" ให้มันล็อกอินผ่าน "ตลอดเวลา" (ชั่วคราว)
        // โดยการ "ปิด" (Comment out) การตรวจสอบ if...else ทิ้งไป
        
        // if (code == ACCESS_CODE) {
        //     return { statusCode: 200, body: JSON.stringify({ success: true, message: 'รหัสผ่านถูกต้อง' }) };
        // } else {
        //     return { statusCode: 401, body: JSON.stringify({ success: false, message: 'รหัสไม่ถูกต้อง' }) };
        // }

        // "บังคับ" ให้ส่ง "สำเร็จ" (Success: true) กลับไปเลย
        return { statusCode: 200, body: JSON.stringify({ success: true, message: 'บังคับล็อกอินผ่าน (Debug Mode)' }) };
        // ---------------------------------
    }

    // === ส่วนที่ 2: ส่งโค้ดแอป (ฉบับทดสอบ) กลับไป ===
    if (action === 'getAppData') {
        
        // --- นี่คือ "แอปทดสอบ" (Test App) ---
        const appHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #1a1a1a; color: white; font-family: sans-serif;">
                <div style="border: 2px dashed #00ff00; padding: 2rem; border-radius: 8px; text-align: center;">
                    <h1 style="color: #00ff00; font-size: 2rem;">DEPLOY สำเร็จ 100%!</h1>
                    <p style="font-size: 1.2rem;">คุณล็อกอินผ่าน และระบบหลังบ้าน (Function) ทำงานแล้ว!</p>
                    <p>ขั้นตอนต่อไป: คัดลอก 'โค้ดแอปจริง' ของคุณมาวางทับ 'แอปทดสอบ' นี้ได้เลย</p>
                </div>
            </div>
        `;
        // ------------------------------------

        const appData = { message: "นี่คือข้อมูลทดสอบ" };

        return {
            statusCode: 200,
            body: JSON.stringify({ appHTML: appHTML, appData: appData })
        };
    }

    return { statusCode: 400, body: JSON.stringify({ message: 'Invalid action' }) };
};

