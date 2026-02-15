export function InfoPage() {
    return (
        <div className="container no-top-margin flex-col justify-start">
            <h1 className="page-header">Info</h1>
            <div className="info-section">
                <h2>About</h2>
                <p>InstaFlip is a policy at Zach Henderson Library to speed up the process of renewing a laptop. Typically, a patron who wants to return and checkout another laptop will recieve a seperate laptop. If there are no laptops available, the patron would have to wait for a staff member to process the laptop.</p>
            </div>
            <div className="info-section">
                <h2>Workflow</h2>
                <div className="info-list">
                    <p>1. Navigate to HOME page by clicking the house icon on the left.</p>
                    <p>2. Click on the "Eagle Id" box in the "Flip Patron" section.</p>
                    <p>3. Ask the patron to scan their eagle id.</p>
                    <p>4. A banner will appear telling you if they are eligible to flip for the semester.</p>
                    <p>5. If the patron is ineligible, the flip button will not appear. Cancel the flip and inform the patron that they have reached the maximum.</p>
                </div>
            </div>
        </div>
    )
}