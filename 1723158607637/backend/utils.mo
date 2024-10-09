import Prng "mo:prng";
import Nat64 "mo:base/Nat64";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Array "mo:base/Array";
import Order "mo:base/Order";
import Hash "mo:base/Hash";
import Option "mo:base/Option";

module {
    /// A random number generator that generates 64-bit unsigned integers.
    /// Example:
    /// Initialize the random number generator in the main actor:
    /// let rand = Utils.Random64();
    /// In the function where you want to generate a random number:
    /// let r = rand.getRangeFrom(0, 100);
    public class Random64() {
        let Prng64 = Prng.SFC64a();
        Prng64.init(0);
        /// Generates a random number in the range [from, to).
        public func getRangeFrom(from: Nat, to: Nat): Nat {
            let v = Nat64.toNat(Prng64.next());
            from + v % (to - from)
        };
    };
    public func arraySort<X>(array: [X], isLessThanOrEqual: (X, X) -> Bool): [X] {
        let compare = Order.lteToOrder(isLessThanOrEqual);
        Array.sort(array, compare);
    };
}