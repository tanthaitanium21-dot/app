/*
 * นี่คือ "ยาแรง" (Strong Medicine) หรือ "โค้ดทดสอบ" (Test Code)
 * เรา "ฝัง" (Hard-code) รหัสผ่าน '1150' ลงไปในโค้ดโดยตรง
 * เพื่อ "พิสูจน์" (Prove) ว่า "ตู้เซฟ" (Environment Variables) ของ Netlify "ไม่ทำงาน" (Is Not Working)
 * นี่ "ไม่ปลอดภัย" (Not Secure) และ "ขายไม่ได้" (Not Sellable) นะครับ!
 * เราใช้มันเพื่อ "ทดสอบ" (Test) เป็น "ครั้งสุดท้าย" (The final time) เท่านั้นครับ
 */

// โค้ด "แอปทดสอบ" (Test App) ที่จะส่งกลับไป
const appHTML = `
<div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #2a3d45; font-family: 'Sarabun', sans-serif;">
    <div style="background-color: #ffffff; padding: 2.5rem; border-radius: 0.75rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center; border-left: 6px solid #4CAF50;">
        <h1 style="color: #4CAF50; font-size: 2.25rem; font-weight: 700; margin-bottom: 1rem;">DEPLOY สำเร็จ 100%</h1>
        <p style="color: #334155; font-size: 1.125rem;">
            คุณล็อกอิน "ผ่าน" แล้ว (ด้วยโค้ด "ฝัง" รหัสผ่าน 1150)
        </p>
        <p style="color: #556677; font-size: 1rem; margin-top: 1.5rem;">
            นี่พิสูจน์ว่า "ตู้เซฟ" (Environment Variables) ของ Netlify "มีปัญหา" (Is the problem) ครับ<br>
            ขั้นตอนต่อไป (ถ้าคุณต้องการ) คือการย้ายไปใช้ "ฐานข้อมูล" (Database) ที่ "ขายได้" (Sellable) ครับ
        </p>
    </div>
</div>
`;

// นี่คือข้อมูล (Data) ของ "แอปทดสอบ" (Test App)
// (ในอนาคต โค้ดแอปจริงของคุณจะมาแทนที่ตรงนี้)
const appData = {
    appName: "Test App v1.0"
};

exports.handler = async (event, context) => {
    try {
        // 1. ตรวจสอบว่ามีข้อมูลส่งมาไหม
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ success: false, message: 'ไม่มีข้อมูลส่งมา' }) };
        }
        
        const body = JSON.parse(event.body);
        const { action, code } = body;

        // 2. ตรวจสอบ "Action" (การกระทำ)
        if (action === 'validateCode') {
            
            // --- นี่คือ "ยาแก้" (The Fix) ---
            // เรา "เลิก" (Stop) ใช้ "ตู้เซฟ" (Environment Variables)
            // const ACCESS_CODE = process.env.ACCESS_CODE; 
            
            // เรา "ฝัง" (Hard-code) รหัสผ่าน '1150' ลงไปตรงๆ เลย
            const HARDCODED_PASSWORD = '1150';

            console.log(`เปรียบเทียบ: (Code ที่พิมพ์: ${code}, Type: ${typeof code}) vs (Hard-coded: ${HARDCODED_PASSWORD}, Type: ${typeof HARDCODED_PASSWORD})`);

            // เราใช้ '==' (2 ตัว) เพื่อเปรียบเทียบ (เผื่อว่าตัวนึงเป็น String อีกตัวเป็น Number)
            if (code == HARDCODED_PASSWORD) {
                // ถ้า "รหัสถูกต้อง" (1150 == 1150)
                console.log('รหัสผ่านถูกต้อง (Hard-coded)');
                return { 
                    statusCode: 200, 
                    body: JSON.stringify({ success: true, message: 'รหัสถูกต้อง' }) 
                };
            } else {
                // ถ้า "รหัสไม่ถูกต้อง"
                console.log('รหัสผ่าน "ไม่" ถูกต้อง (Hard-coded)');
                return { 
                    statusCode: 401, 
                    body: JSON.stringify({ success: false, message: 'รหัสไม่ถูกต้อง (Hard-coded)' }) 
                };
            }
            // --- จบส่วน "ยาแก้" (The Fix) ---

        } else if (action === 'getAppData') {
            // 3. ถ้า "Action" คือ 'getAppData' (ขอข้อมูลแอป)
            // (นี่คือขั้นตอนที่ 2 หลังจากล็อกอินผ่านแล้ว)
            // ส่ง "โค้ดแอปทดสอบ" (Test App) กลับไป
            return {
                statusCode: 200,
                body: JSON.stringify({ appHTML: appHTML, appData: appData })
            };
        } else {
            // 4. ถ้า "Action" ไม่รู้จัก
            return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Action ไม่รู้จัก' }) };
        }

    } catch (error) {
        // 5. ถ้า "พัง" (Error) (เช่น JSON ผิด)
        console.error('เกิด Error ใน Function:', error);
        return { 
            statusCode: 500, 
            body: JSON.stringify({ success: false, message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error: error.message }) 
        };
    }
};

