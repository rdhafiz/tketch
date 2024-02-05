import React from 'react';

const TaskSingle = () => {
    return (
        <>
            <div className={`flex`}>
                <div id={`detail-section`} className={`w-2/3`}>
                    <div className={`font-bold text-2xl mb-2`}>Task FE+BE</div>
                    <div>Description</div>
                    <div className={``}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius et magnam
                        reprehenderit tenetur voluptatum! Aliquid consequatur consequuntur est in ipsum, laborum,
                        molestias officiis quas rem, saepe sed similique. Aliquid, explicabo.
                    </div>
                </div>
                <div id={`info-section`} className={``}></div>
            </div>
        </>
    );
};

export default TaskSingle;