const SectionWrapper = (Component, idName) =>
function HOC() {
    return (
        <section className="max-w-7xl mx-auto relative z-0 sm:px-16 sm:py-16 py-10">
            <span className="hash-span" id={idName}>&nbsp;</span>
            <Component />
        </section>
    )
}
export default SectionWrapper;