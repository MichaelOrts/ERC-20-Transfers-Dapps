import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const NotConnected: React.FC = () => {
    return (
        <Alert className="text-red-600" variant="destructive">
            <AlertTitle className="">Warning</AlertTitle>
            <AlertDescription className="">
                Please connect your Wallet to our DApp.
            </AlertDescription>
        </Alert>
    );
}

export default NotConnected;