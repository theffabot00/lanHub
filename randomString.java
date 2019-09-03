import java.lang.Math;

public class randomString {
    // public randomString() {
    // }

    public static void main(String[] args) {
        System.out.print(generateString(Integer.parseInt(args[0])));
    }

    public static String generateString(int n) {
        String s = "";
        char[] alphabet = {
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            '1','2','3','4','5','6','7','8','9','0'
        };
        int len = alphabet.length;
        for (int k = 0; k != n; k++) {
            int q  = (int) Math.floor( (Math.random() * len) );
            s += alphabet[q];
        }
        return(s);
    }
}
