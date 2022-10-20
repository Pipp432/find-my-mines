import React from 'react'
import { SocketContext } from '../socket'
import { GlobalContext } from '../states';

export default function ReplyReceiver() {
    const { global_state, dispatch } = React.useContext(GlobalContext) ;
    const { socket } = React.useContext(SocketContext);
    const { receiver } = global_state;
    const [ mode, setMode ] = React.useState<number>(0);
    //mode 0 = not visible
    //mode 1 = (sender) gets accepted or decline
    const [ decision, setDecision ] = React.useState<boolean>(false);
    const [ receiverName, setReceiverName ] = React.useState<string>("");
    const handleOnClickClose = () => {
        setMode(0);
    }
    React.useEffect(()=>{
        if (socket !== undefined) {
            socket.on("reply incoming", ({
                receiverName, decision
            }:{
                receiverName:string, decision:boolean
            }) => {
                setDecision(decision);
                setReceiverName(receiverName);
                const newReceiver = { ...receiver };
                newReceiver[receiverName] = decision;
                dispatch({
                    type:"set",
                    field:"receiver",
                    payload:newReceiver,
                })
                setMode(1);
            });
        }
    },[socket])
    return (
        mode!==0?
            <div
                className="absolute top-0 bottom-0 left-0 right-0 w-[30%] h-1/2 text-white
                text-2xl bg-neutral-700 rounded-3xl z-50 flex m-auto shadow-md" 
            >
                <button 
                    onClick={handleOnClickClose}
                    className="absolute -top-1 -left-1 w-10 h-10 bg-neutral-500
                    text-center rounded-full font-righteous shadow-md"
                >
                    X
                </button>
                {mode===1 &&
                    <div className="m-auto">
                        <div className="text-4xl font-righteous px-10">
                            YOUR INVITATION WAS {decision?"ACCEPTED":"DECLINED"}
                        </div>
                        <div className="text-3xl text-cyan-400 font-quicksand px-10">
                            (to {receiverName})
                        </div>
                    </div>
                }
            </div>
        :null
    )
}