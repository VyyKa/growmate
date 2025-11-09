import { Button, type ButtonProps } from "antd"
import { useAsyncAction, type AsyncFunction } from "../hooks/useAsyncAction"

type LoadingButtonProps = ButtonProps & {
  onClickAsync?: AsyncFunction<any[], any>
  loadingText?: string
}

export default function LoadingButton({
  onClickAsync,
  loading: loadingProp,
  loadingText,
  children,
  onClick,
  className,
  ...rest
}: LoadingButtonProps) {
  const { run, loading } = useAsyncAction(async () => {
    if (onClickAsync) {
      await onClickAsync()
    }
  })

  const isLoading = (loadingProp as boolean | undefined) ?? loading

  return (
    <Button
      {...rest}
      className={`!h-[50px] !text-base !font-medium ${className || ""}`}
      loading={isLoading}
      onClick={async (e) => {
        if (onClick) onClick(e)
        if (onClickAsync) await run()
      }}
    >
      {isLoading && loadingText ? loadingText : children}
    </Button>
  )
}
