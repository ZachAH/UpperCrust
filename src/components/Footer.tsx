export default function Footer() {
    return (
      <footer className="bg-black text-gray-400 text-center py-6 mt-12">
        <p>&copy; {new Date().getFullYear()} Upper Crust Pizza. All rights reserved.</p>
        <p className="text-sm mt-1">Website by Zach Howell 🍕</p>
      </footer>
    );
  }
  