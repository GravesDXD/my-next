import styles from './tip.module.css'
import cn from 'classnames'
import ClientOnlyPortal from '../ClientOnlyPortal'

export default function Tip({ children, type }) {
    return (
        <ClientOnlyPortal selector="#modal">
            <div className={cn({
                [styles.tip]: true,
                [styles.success_bg]: type === 'success',
                [styles.error_bg]: type === 'error'
            })}>
                <div
                    className={cn({
                        [styles.success]: type === 'success',
                        [styles.error]: type === 'error'
                    })}
                >
                    {children}
                </div>
            </div>
        </ClientOnlyPortal >
    )
}