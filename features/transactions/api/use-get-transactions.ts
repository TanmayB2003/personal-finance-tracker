import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

type Props = {
    from: string;
    to: string;
    accountId: string;
}

export const useGetTransactions = ({
    from,
    to,
    accountId
}: Props) => {
    const query = useQuery({
        queryKey:["transactions", { from, to, accountId }],
        queryFn: async () => {
            const response = await client.api.transactions.$get({
                query: {
                    from,
                    to, 
                    accountId,
                },
            });

            if(!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const { data } = await response.json();
            return data.map((transaction) => ({
                ...transaction,
                amount: convertAmountFromMiliunits(transaction.amount),
            }));
        }
    })

    return query;
}
