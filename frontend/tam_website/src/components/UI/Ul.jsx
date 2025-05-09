import useHttp from '../../hooks/useHttp.jsx';

export default function Ul({ 
  component: Component, 
  url, 
  options, 
  componentProps, 
  ...props 
}) {
const { isLoading, isError, data } = useHttp(url, options);

return (
  <section {...props}>
    {isError && <div className='text-center text-red-500'>{isError}</div>}
    {isLoading && <div className='text-center'>Fetching data...</div>}
    {!isLoading && !isError && Array.isArray(data) && data.length > 0 && (
      data.map((item) => {
        return <Component key={item.id} {...item} {...componentProps} />
      })
    )}
    {!isLoading && !isError && Array.isArray(data) && data.length === 0 && (
      <div className='text-center text-gray-500'>No items found.</div>
    )}
  </section>
);
}