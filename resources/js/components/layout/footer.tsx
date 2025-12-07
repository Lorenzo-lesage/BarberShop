export default function Footer() {
    return (
        <footer className="bg-gray-100 p-4 text-center text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            &copy; {new Date().getFullYear()} BarberShop
        </footer>
    );
}
