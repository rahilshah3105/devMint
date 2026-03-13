// Approach 1: use code with filename specified
const javaCode1 = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`;

// Approach 2: rename public class to match Wandbox's default filename format
// Wandbox uses "prog.java" for Java, so let's test with class prog
const javaCode2 = `class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`;

// Approach 3: same as 1 but using 'code_file_name' field
const test = async (label, body) => {
    const res = await fetch('https://wandbox.org/api/compile.json', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ compiler: 'openjdk-jdk-22+36', save: false, ...body })
    });
    const d = await res.json();
    const msg = (d.program_message || d.compiler_message || d.compiler_error || '').replace(/\n/g, ' ').slice(0, 80);
    console.log(`[${label}] status=${d.status} msg="${msg}"`);
};

await test('approach1-public-class-via-codes-as-main', { code: '', codes: [{ file: 'Main.java', code: javaCode1 }] });
await test('approach2-non-public-class', { code: javaCode2 });
await test('approach3-public-class-raw', { code: javaCode1 });
